var table = CycleDOM.table, tr = CycleDOM.tr, th = CycleDOM.th, td = CycleDOM.td, ul = CycleDOM.ul, li = CycleDOM.li,
    input = CycleDOM.input, div = CycleDOM.div, span = CycleDOM.span, br = CycleDOM.br, label = CycleDOM.label; 

function createStateComponents(stateController) {
    var navigationLink = (properties, children) => NavigationCycle.navigationLink(stateController, properties, children);
    var refreshLink = (properties, children) => NavigationCycle.refreshLink(stateController, properties, children);
    var navigationBackLink = (properties, children) => NavigationCycle.navigationBackLink(stateController, properties, children);
    var peopleState = stateController.states.people;        
    peopleState.intent = function(sources) {
        return sources.Navigation.map(function(context) {
            return { 
                people: personSearch.search(context.data.name, context.data.sortExpression),
                startRowIndex: context.data.startRowIndex,
                maximumRows: context.data.maximumRows,
                sortExpression: context.data.sortExpression,
                name: context.data.name
            }
        })
    };
    peopleState.model = function(data$) {
        return data$.map(function(data) {
            var totalRowCount = data.people.length;
            var remainder = totalRowCount % data.maximumRows;
            var previous = Math.max(0, data.startRowIndex - data.maximumRows);
            var next = data.startRowIndex + data.maximumRows;
            var last = remainder != 0 ? totalRowCount - remainder : totalRowCount - data.maximumRows;
            if (next >= totalRowCount)
                next = last = data.startRowIndex;
            var people = data.people.slice(data.startRowIndex, data.startRowIndex + data.maximumRows);
            var sortExpression = data.sortExpression.indexOf('DESC') === -1 ? 'Name DESC' : 'Name';
            return {
                people: people,
                sortExpression: sortExpression,
                totalRowCount: totalRowCount,
                name: data.name,
                previous: previous,
                next: next,
                last: last
            }
        })
    };
    peopleState.view = function(data$) {
        return data$.map(function(data) { 
            return div([
                div([
                    div([
                        label({ htmlFor: 'name' }, 'Name'),
                        input('#name', { value: data.name ? data.name : '' }) 
                    ]),
                    span('Page size '),
                    refreshLink({ toData: { maximumRows: 5, startRowIndex: null }, includeCurrentData: true, activeCssClass: 'active' }, '5'), span(' '),
                    refreshLink({ toData: { maximumRows: 10, startRowIndex: null }, includeCurrentData: true, activeCssClass: 'active' }, '10')
                ]),
                table([
                    tr([
                        th([ refreshLink({ toData: { sortExpression: data.sortExpression }, includeCurrentData: true }, 'Name') ]),
                        th('Date of Birth')                            
                    ])]
                    .concat(data.people.map(function(person) {
                        return tr([
                            td([ navigationLink({ state: 'person', toData: { id: person.id }}, person.name) ]),
                            td(person.dateOfBirth)
                        ])
                    }))
                ),
                ul([
                    li([ refreshLink({ toData: { startRowIndex: 0 }, includeCurrentData: true, disableActive: true }, 'First') ]),
                    li([ refreshLink({ toData: { startRowIndex: data.previous }, includeCurrentData: true, disableActive: true }, 'Previous') ]),
                    li([ refreshLink({ toData: { startRowIndex: data.next }, includeCurrentData: true, disableActive: true }, 'Next') ]),
                    li([ refreshLink({ toData: { startRowIndex: data.last }, includeCurrentData: true, disableActive: true }, 'Last') ])
                ]),
                span('Total Count ' + data.totalRowCount)
            ])
        })
    };
    peopleState.component = function(sources) {
        var vtree$ = peopleState.view(peopleState.model(peopleState.intent(sources)));
        var search$ = sources.DOM.select('input').events('blur')
            .map(function(e) {
                return { 
                    toData: { 
                        name: e.target.value,
                        startRowIndex: null
                    },
                    includeCurrentData: true
                };
            }
        ) 
        return {
            DOM: vtree$,
            Navigation: sources.DOM.select('a').events('click').merge(search$)
        }
    };
    
    var personState = stateController.states.person;
    personState.intent = function(sources) {
        return sources.Navigation.map(function(context) {
            return personSearch.getDetails(context.data.id)
        })
    };
    personState.model = function(person$) {
        return person$;
    }   
    personState.view = function(person$) {
        return person$.map(function(person) {
            return div([
                navigationBackLink({ distance: 1 }, 'Person Search'),
                div([
                    span('Name:' + person.name), br(),
                    span('Date of birth:' + person.dateOfBirth)
                ])
            ])
        })
    };
    personState.component = function(sources) {
        var vtree$ = personState.view(personState.model(personState.intent(sources)));
        return {
            DOM: vtree$,
            Navigation: sources.DOM.select('a').events('click')
        }
    };
}

function main(sources) {
    var stateController = new Navigation.StateController([
        { key: 'people', route: '{startRowIndex}/{maximumRows}/{sortExpression}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackTypes: false, title: 'Person Search' },
        { key: 'person', route: 'person', defaultTypes: { id: 'number' }, trackTypes: false, trackCrumbTrail: true, title: 'Person Details', }
    ]);
    createStateComponents(stateController);
    var component$$ = sources.Navigation.map(function(context) {
        return context.state.component(sources);
    });
    return {
        DOM: component$$.map(function(component) { return component.DOM }).switch(),
        Navigation: component$$.map(function(component) { return component.Navigation }).switch()
            .startWith({ stateController: stateController })
    };
}

Cycle.run(main, {
    DOM: CycleDOM.makeDOMDriver('#content'),
    Navigation: NavigationCycle.makeNavigationDriver()
});
