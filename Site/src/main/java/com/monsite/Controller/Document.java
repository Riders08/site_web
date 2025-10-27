package com.monsite.Controller;

public class Document {
    private byte[] data;
    private String type;
    private String filename;

    public Document(byte[] data, String type, String filename) {
        this.data = data;
        this.type = type;
        this.filename = filename;
    }

    public byte[] getData() { 
        return data; 
    }

    public String getType() { 
        return type; 
    }

    public String getFilename() { 
        return filename; 
    }
}
