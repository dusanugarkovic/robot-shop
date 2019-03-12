package org.steveww.spark;

public class City {

    private String uuid;
    private String name;

    public City(String uuid, String name) {
        this.uuid = uuid;
        this.name = name;
    }

    public City() {
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
