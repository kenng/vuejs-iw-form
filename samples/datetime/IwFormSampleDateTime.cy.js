import { mount } from 'cypress/vue'
import IwFormSampleDateTimeVue from './IwFormSampleDateTime.vue'

describe('IwFormSampleDateTime', () => {
    it('should display simple date value', () => {
        mount(IwFormSampleDateTimeVue)

        cy.get('.iwFormInputCalendar').should('have.value', '2023-08-21');
    })
})
