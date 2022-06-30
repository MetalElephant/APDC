package pt.unl.fct.di.adc.avindividual.util;

import java.util.Comparator;

import pt.unl.fct.di.adc.avindividual.util.Info.MessageInfo;

public class SortByOrder implements Comparator<MessageInfo>{

    @Override
    public int compare(MessageInfo o1, MessageInfo o2) {
        return Math.toIntExact(o1.order - o2.order);
    }
    
}
