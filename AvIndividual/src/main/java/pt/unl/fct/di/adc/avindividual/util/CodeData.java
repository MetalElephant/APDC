package pt.unl.fct.di.adc.avindividual.util;

public class CodeData {
    
    String owner, code;
    long expirationDate;

    public CodeData(String owner, String code, long expirationDate) {
        this.owner = owner;
        this.code = code;
        this.expirationDate = expirationDate;
    }
}
