package com.atns.atns.converter;

public abstract class AbstractConverter<D, E> {

    public abstract D toDto(E e);

    public abstract E toEntity(D d);
}
