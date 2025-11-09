const API = '**/api/todos*';

describe('Todos – flujos principales', () => {
  beforeEach(() => {
    cy.intercept('GET', API, { statusCode: 200, body: [] }).as('getTodos');
    cy.visit('/');
    cy.wait('@getTodos');
  });

  it('Crear: agrega una tarea y se ve en la lista', () => {
    cy.intercept('POST', '**/api/todos', (req) => {
      expect(req.body.title).to.contain('Comprar pan');
      req.reply({ statusCode: 201, body: { id: '1', title: req.body.title, done: false } });
    }).as('createTodo');

    cy.get('[data-cy=todo-input], input[name="todo"], input[placeholder*="todo" i]').first().type('Comprar pan');
    cy.get('[data-cy=add-btn], button:contains("Agregar"), button:contains("Add")').first().click();

    cy.wait('@createTodo');
    cy.contains('[data-cy=todo-item], li', 'Comprar pan').should('be.visible');
  });

  it('Editar: modifica el título de una tarea existente', () => {
    cy.intercept('GET', API, { statusCode: 200, body: [{ id: '10', title: 'Original', done: false }] }).as('seed');
    cy.visit('/');
    cy.wait('@seed');

    cy.intercept('PUT', '**/api/todos/10', (req) => {
      expect(req.body.title).to.eq('Editada');
      req.reply({ statusCode: 200, body: { id: '10', title: 'Editada', done: false } });
    }).as('updateTodo');

    cy.get('[data-cy=edit-10], button[id*="edit-10"], button:contains("Editar")').first().click();
    cy.get('[data-cy=todo-input], input[name="todo"]').clear().type('Editada');
    cy.get('[data-cy=save-10], button[id*="save-10"], button:contains("Guardar")').first().click();

    cy.wait('@updateTodo');
    cy.contains('[data-cy=todo-item], li', 'Editada').should('be.visible');
  });

  it('Error: muestra feedback cuando la API falla', () => {
    cy.intercept('POST', '**/api/todos', { statusCode: 500, body: { message: 'Boom' } }).as('createFail');

    cy.get('[data-cy=todo-input], input[name="todo"]').type('Falla controlada');
    cy.get('[data-cy=add-btn], button:contains("Agregar"), button:contains("Add")').click();
    cy.wait('@createFail');

    cy.contains(/error|falló|failed|intente|try again/i).should('be.visible');
  });
});
