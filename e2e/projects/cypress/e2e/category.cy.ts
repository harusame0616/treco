import { getAuth, signInAnonymously, connectAuthEmulator } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

beforeEach(() => {
  cy.viewport('iphone-7');
});

describe('カテゴリ', () => {
  beforeEach(() => {
    cy.visit('http://web:3000/auth/signout');
    cy.get('.sign-in-anonymously-button-container button').click();
  });

  it('一覧表示する', () => {
    const categoryName = 'test_category' + Math.floor(Math.random() * 100);
    cy.get('.new-activity-button-container button').click();
    cy.url().should('include', '/home/categories');
    cy.get('.new-category-button-container button').click();
    cy.get('.category-name-textfield').type(categoryName);
    cy.get('.base-dialog .primary-button').click();
    cy.wait(5000);
    cy.get(`.category-label`).last().should('have.text', categoryName);
  });

  it('新規作成する', () => {
    const categoryName = 'test_category' + Math.floor(Math.random() * 100);
    cy.get('.new-activity-button-container button').click();
    cy.url().should('include', '/home/categories');
    cy.get('.new-category-button-container button').click();
    cy.get('.category-name-textfield').type(categoryName);
    cy.get('.base-dialog .primary-button').click();
    cy.wait(5000);
    cy.get(`.category-label`).last().should('have.text', categoryName);
  });

  it('削除する', () => {
    const categoryName = 'test_category' + Math.floor(Math.random() * 100);
    cy.get('.new-activity-button-container button').click();
    cy.url().should('include', '/home/categories');
    cy.get('.new-category-button-container button').click();
    cy.get('.category-name-textfield').type(categoryName);
    cy.get('.base-dialog .primary-button').click();
    cy.wait(5000);
    cy.get(`.category-label`).last().should('have.text', categoryName);
    cy.get(`.category-item-${categoryName} .delete-button`).click();
    cy.get('.base-dialog .primary-button').click();
    cy.wait(5000);
    cy.get(`.category-label`).last().should('not.have.text', categoryName);
  });

  it('編集する', () => {
    const categoryName = 'test_category' + Math.floor(Math.random() * 100);
    cy.get('.new-activity-button-container button').click();
    cy.url().should('include', '/home/categories');
    cy.get('.new-category-button-container button').click();
    cy.get('.category-name-textfield').type(categoryName);
    cy.get('.base-dialog .primary-button').click();
    cy.wait(5000);
    cy.get(`.category-label`).last().should('have.text', categoryName);
    cy.get(
      `.category-item-${categoryName} .edit-button-container button`
    ).click();
    const categoryEditName = 'edit_category' + Math.floor(Math.random() * 100);
    cy.get('.category-name-textfield').clear().type(categoryEditName);
    cy.get('.base-dialog .primary-button').click();
    cy.wait(5000);
    cy.get(`.category-label`).last().should('have.text', categoryEditName);
  });
});
