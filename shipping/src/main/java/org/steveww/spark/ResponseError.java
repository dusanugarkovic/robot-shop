package org.steveww.spark;

public class ResponseError {

    private String message;

    public ResponseError(String message) {
        this.message = message;
    }

    public ResponseError(Exception e) {
        this.message = e.getMessage();
    }

    public String getMessage() {
        return this.message;
    }
}
