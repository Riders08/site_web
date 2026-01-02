package com.monsite.models;


public class Document {
    private long id;
    private byte[] data;
    private String type;
    private String filename;
    private String[] keys;

    public Document(){}

    public Document(byte[] data, String type, String filename) {
        this.data = data;
        this.type = type;
        this.filename = filename;
    }

    public long getId(){
        return this.id;
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

    public String[] getKeys(){
        return keys;
    }

    public void setId(long id){
        this.id = id;
    }

    public void setData(byte[] data){
        this.data = data;
    }

    public void setType(String type){
        this.type = type;
    }

    public void setFilename(String filename){
        this.filename = filename;
    }

    public void setKeys(String[] keys) {
        this.keys = keys;
    }
}
