import { mount } from 'cypress/vue'
import IwFormSampleDateTimeBasicVue from './IwFormSampleDateTimeBasic.vue'

describe('IwFormSampleDateTimeBasic', () => {
    it('should display simple date value', () => {
        mount(IwFormSampleDateTimeBasicVue)

        cy.get('.iwFormInputCalendar').should('have.value', '2023-08-21');
    })
})
