describe("Finalizar pedido", () => {
  it("Deve ser possível finalizar o pedido com sucesso", () => {
    const headphone = "BEATS STUDIO 2 OVER-EAR MATTE BLACK HEADPHONES";
    // Intercepta a requisição GET para o endpoint
    cy.intercept(
      "GET",
      "https://www.advantageonlineshopping.com/catalog/api/v1/categories"
    ).as("getCategories");

    cy.visit("/");

    cy.wait("@getCategories").its("response.statusCode").should("eq", 200);
    cy.get("#menuSearch").click();
    cy.get("#autoComplete").type("headphone");
    cy.wait(2000);
    cy.contains("p", headphone).should("be.visible").click();

    cy.get("#Description")
      .contains("h1", " BEATS STUDIO 2 OVER-EAR MATTE BLACK HEADPHONES ", {
        timeout: 7000,
      })
      .should("be.visible");

    cy.get('button[name="save_to_cart"]').click();

    cy.get("#checkOutPopUp").click();

    cy.get('input[name="usernameInOrderPayment"]', { timeout: 7000 }).type(
      "Daniel"
    );
    cy.get('input[name="passwordInOrderPayment"]', { timeout: 7000 }).type(
      "Teste@123",
      { log: false }
    );

    cy.contains("h3", "ORDER PAYMENT").should("be.visible");
    cy.get("#login_btn").click();

    cy.get(".nextBtn").click();

    cy.get('input[name="masterCredit"]').check();

    cy.get(".edit").then(($edit) => {
      if ($edit.is(":visible")) {
        cy.wrap($edit).click()
      } else {
        cy.wait(2000);
        cy.get("#creditCard").type("1234 5434 4983");
        cy.wait(2000);
        cy.get('input[name="cvv_number"]').click();
        cy.contains("label", "CVV number").type("8764");
        cy.get('select[name="mmListbox"]')
          .select("04")
          .should("have.value", "string:04");

        cy.get('select[name="yyyyListbox"]')
          .select("2030")
          .should("have.value", "string:2030");

        cy.contains("label", "Cardholder").type("Daniel M");
      }
    });


    cy.get('#pay_now_btn_ManualPayment').click()
    cy.get('h2')
      .contains('span','Thank you for buying with Advantage')
      .should('be.visible')
  });
});
