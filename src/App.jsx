/* eslint-disable jsx-a11y/accessible-emoji */
import cn from 'classnames';
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const user = category
    ? usersFromServer.find(usr => usr.id === category.ownerId)
    : null;

  return {
    ...product,
    category: category && `${category.icon} - ${category.title}`,
    owner: user.name,
    ownerSex: user.sex,
    ownerId: user.id,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredProducts = products.filter(product => {
    const isUserMatch = selectedUserId
      ? product.ownerId === selectedUserId
      : true;
    const isCategoryMatch = selectedCategories.length
      ? selectedCategories.includes(product.categoryId)
      : true;

    return isUserMatch && isCategoryMatch;
  });

  const searchedProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  ); // eslint-disable-line

  const resetFilters = () => {
    setSelectedCategories([]);
  };

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedUserId('');
    setQuery('');
  };

  const toggleCategorySelection = categoryId => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(categoryId)
        ? prevCategories.filter(id => id !== categoryId)
        : [...prevCategories, categoryId],
    ); // eslint-disable-line
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': !selectedUserId })}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', 'is-active', {
                  'is-outlined': selectedCategories.length > 0,
                })}
                onClick={resetFilters}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  href="#/"
                  className={cn('button', 'mr-2', 'my-1', {
                    'button is-info': selectedCategories.includes(category.id),
                  })}
                  onClick={() => toggleCategorySelection(category.id)}
                >
                  {category.icon} {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {searchedProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria{' '}
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />{' '}
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />{' '}
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchedProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{product.category}</td>
                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.ownerSex === 'm',
                        'has-text-danger': product.ownerSex === 'f',
                      })}
                    >
                      {product.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
