package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;


import java.security.Key;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    /**
     * Construct a controller for todos.
     *
     * @param database the database containing todo data
     */
    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }


    /**
     * Get a JSON response with a list of all the todos in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one todo in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getTodo(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String todo;
        try {
            todo = getTodo(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested todo id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (todo != null) {
            return todo;
        } else {
            res.status(404);
            res.body("The requested todo with id " + id + " was not found");
            return "";
        }
    }




    /**
     * Get the single todo specified by the `id` parameter in the request.
     *
     * @param id the Mongo ID of the desired todo
     * @return the desired todo as a JSON object if the todo with that ID is found,
     * and `null` if no todo with that ID is found
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        } else {
            // We didn't find the desired todo
            return null;
        }
    }


    /**
     * @param req
     * @param res
     * @return an array of todos in JSON formatted String
     */
    public String getTodos(Request req, Response res)
    {
        res.type("application/json");
        return getTodos(req.queryMap().toMap());
    }

    /**
     * @param queryParams
     * @return an array of Todos in a JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }

    /**
     * @param req
     * @param res
     * @return an array of todos in JSON formatted String
     */
    public String todoSummary(Request req, Response res)
    {
        res.type("application/json");
        Map<String, Float> total = todoSummaryTotal(req.queryMap().toMap());
        Map<String, Float> category = todoSummaryCategory(req.queryMap().toMap());
        Map<String, Float> owner = todoSummaryOwner(req.queryMap().toMap());

        Document Summary = new Document();
        Summary.append("Total", total);
        Summary.append("Owner completion", owner);
        Summary.append("category completion", category);
        return JSON.serialize(Summary);
        //return JSON.serialize(todoSummaryCategory(req.queryMap().toMap()));
    }

    public Map<String, Float> todoSummaryTotal(Map<String, String[]> queryParams){
        Iterable<Document> totalcomplete = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.match(Filters.eq("status", "complete")),
                Aggregates.group("$status", Accumulators.sum("count",1))
            ));
        Map<String, Float> statustotalPercent = new HashMap<>();
        float total = todoCollection.count();
        for(Document doc: totalcomplete){
            statustotalPercent.put(doc.getString("_id"), doc.getInteger("count")/total);
        }
        if(statustotalPercent.isEmpty()){
            float a = 0;
            statustotalPercent.put("complete", a);
        }

        return statustotalPercent;

    }

    public Map<String, Float> todoSummaryOwner(Map<String, String[]> queryParams){
        Iterable<Document> ownerincomplete = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.match(Filters.eq("status", "incomplete")),
                Aggregates.group("$owner", Accumulators.sum("count",1))
            ));
        Iterable<Document> ownercomplete = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.match(Filters.eq("status","complete")),
                Aggregates.group("$owner", Accumulators.sum("count", 1))
            ));
        Map<String, Integer> ownerCompleteCounts = new HashMap<>();
        Map<String, Float> ownerCompletePercents = new HashMap<>();
        for(Document doc: ownercomplete){
            ownerCompleteCounts.put(doc.getString("_id"), doc.getInteger("count"));
        }
        Map<String, Integer> ownerIncompleteCounts = new HashMap<>();
        for (Document doc : ownerincomplete) {
            ownerIncompleteCounts.put(doc.getString("_id"), doc.getInteger("count"));
        }
        for (String doc : ownerCompleteCounts.keySet()){
            float a;
            if(ownerCompleteCounts.get(doc) != null) {
                a = ownerCompleteCounts.get(doc);
            } else {
                a = 0;
            }
            float b;
            if(ownerIncompleteCounts.get(doc) != null) {
                b = ownerIncompleteCounts.get(doc);
            } else {
                b = 0;
            }
            float c = a+b;
            ownerCompletePercents.put(doc, a/c);
        }

        for (String doc : ownerIncompleteCounts.keySet()){
            if(ownerCompletePercents.get(doc) == null){
                float a = 0;
                ownerCompletePercents.put(doc, a);
            }
        }
        return ownerCompletePercents;

    }

    public Map<String, Float> todoSummaryCategory(Map<String, String[]> queryParams){
        Iterable<Document> categoryincomplete = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.match(Filters.eq("status", "incomplete")),
                Aggregates.group("$category", Accumulators.sum("count",1))
            ));
        Iterable<Document> categorycomplete = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.match(Filters.eq("status","complete")),
                Aggregates.group("$category", Accumulators.sum("count", 1))
            ));
        Map<String, Integer> categoryCompleteCounts = new HashMap<>();
        Map<String, Float> categoryCompletePercents = new HashMap<>();
        for(Document doc: categorycomplete){
            categoryCompleteCounts.put(doc.getString("_id"), doc.getInteger("count"));
        }
        Map<String, Integer> categoryIncompleteCounts = new HashMap<>();
        for (Document doc : categoryincomplete) {
            categoryIncompleteCounts.put(doc.getString("_id"), doc.getInteger("count"));
        }
        for (String doc : categoryCompleteCounts.keySet()){
            float a;
            if(categoryCompleteCounts.get(doc) != null) {
                a = categoryCompleteCounts.get(doc);
            } else {
                a = 0;
            }
            float b;
            if(categoryIncompleteCounts.get(doc) != null) {
                b = categoryIncompleteCounts.get(doc);
            } else {
                b = 0;
            }
            float c = a+b;
            categoryCompletePercents.put(doc, a/c);
        }

        for (String doc : categoryIncompleteCounts.keySet()){
            if(categoryCompletePercents.get(doc) == null){
                float a = 0;
                categoryCompletePercents.put(doc, a);
            }
        }
        return categoryCompletePercents;

    }


    public String todoDrop(Request req, Response res){
        //Document summary = new Document();
        res.type("application/json");
        todoCollection.drop();

        return getTodos(req.queryMap().toMap());
    }

    /**
     *
     * @param req
     * @param res
     * @return
     */
    public boolean addNewTodo(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String owner = dbO.getString("owner");
                    //For some reason age is a string right now, caused by angular.
                    //This is a problem and should not be this way but here ya go
                    String status = dbO.getString("status");
                    String body = dbO.getString("body");
                    String category = dbO.getString("category");

                    System.err.println("Adding new todo [owner=" + owner + ", status=" + status + " body=" + body + " category=" + category + ']');
                    return addNewTodo(owner, status, body, category);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new todo request failed.");
                    return false;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return false;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return false;
        }
    }

    /**
     *
     * @param owner
     * @param status
     * @param body
     * @param category
     * @return
     */
    public boolean addNewTodo(String owner, String status, String body, String category) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("status", status);
        newTodo.append("body", body);
        newTodo.append("category", category);

        try {
            todoCollection.insertOne(newTodo);
        }
        catch(MongoException me)
        {
            me.printStackTrace();
            return false;
        }

        return true;
    }




}
