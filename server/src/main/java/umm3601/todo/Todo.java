package umm3601.todo;

import org.bson.types.ObjectId;

public class Todo {
    ObjectId _id;
    String owner;
    String status;
    String body;
    String category;
}
