package org.steveww.spark;

public class Code {

    private String code;
    private String name;

    public Code(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public Code() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
