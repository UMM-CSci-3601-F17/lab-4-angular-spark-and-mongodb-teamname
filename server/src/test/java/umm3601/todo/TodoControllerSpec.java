package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class TodoControllerSpec
{
    private TodoController todoController;
    private ObjectId samsId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Chris\",\n" +
            "                    status: \"complete\",\n" +
            "                    body: \"UMM\",\n" +
            "                    category: \"chris@this.that\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Pat\",\n" +
            "                    status: \"incomplete\",\n" +
            "                    body: \"IBM\",\n" +
            "                    category: \"pat@something.com\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Jamie\",\n" +
            "                    status: \"incomplete\",\n" +
            "                    body: \"Frogs, Inc.\",\n" +
            "                    category: \"jamie@frogs.com\"\n" +
            "                }"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("owner", "Sam")
            .append("status", "complete")
            .append("body", "Frogs, Inc.")
            .append("category", "sam@frogs.com");



        todoDocuments.insertMany(testTodos);
        todoDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        todoController = new TodoController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllTodos() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Chris", "Jamie", "Pat", "Sam");
        assertEquals("Owners should match", expectedOwners, names);
    }

    @Test
    public void getUsersWhoArepatsomethingcom() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("category", new String[] { "pat@something.com" } );
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 todo", 1, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Pat");
        assertEquals("Names should match", expectedOwners, owners);
    }

    @Test
    public void getUsersWhoAreComplete() {
        Map<String, String[]> argMap = new HashMap<>();

        argMap.put("status", new String[] {"complete"} );
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Chris", "Sam");
        assertEquals("Names should match", expectedOwners, owners);
    }

    @Test
    public void getUsersWhoAreFrogsInc() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("body", new String[] { "Frogs, Inc." });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todo", 2, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Jamie", "Sam");
        assertEquals("Names should match", expectedNames, owners);
    }

    @Test
    public void getSamById() {
        String jsonResult = todoController.getTodo(samsId.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Owner should match", "Sam", sam.get("owner"));
    }
}
