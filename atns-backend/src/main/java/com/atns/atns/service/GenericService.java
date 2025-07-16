package com.atns.atns.service;

import java.util.List;

public interface GenericService<D, ID> {
    D save(D d);
    D update(D d);
    D findById(ID id);
    List<D> findAll();
    void delete(ID id);
}
