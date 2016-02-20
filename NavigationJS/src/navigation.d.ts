﻿// Type definitions for Navigation 2.0.0
// Project: http://grahammendick.github.io/navigation/
// Definitions by: Graham Mendick <https://github.com/grahammendick>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare module 'navigation' {
    export = Navigation;
} 

declare module Navigation {
    /**
     * Defines a contract a class must implement in order to configure a State
     */
    interface IState {
        /**
         * Gets the unique key
         */
        key: string;
        /**
         * Gets the default NavigationData for this State
         */
        defaults?: any;
        /**
         * Gets the default NavigationData Types for  this State
         */
        defaultTypes?: any;
        /**
         * Gets the textual description of the state
         */
        title?: string;
        /**
         * Gets the route Url patterns
         */
        route: string | string[];
        /**
         * Gets a value that indicates whether to maintain the crumb trail 
         */
        trackCrumbTrail?: boolean | string;
        /**
         * Gets a value that indicates whether NavigationData Types are
         * preserved when navigating
         */
        trackTypes?: boolean;
        /**
         * Gets the additional state attributes
         */
        [extras: string]: any;
    }

    /**
     * Represents the endpoint of a navigation
     */
    class State implements IState {
        /**
         * Gets the unique key
         */
        key: string;
        /**
         * Gets the default NavigationData for this State
         */
        defaults: any;
        /**
         * Gets the default NavigationData Types for  this State
         */
        defaultTypes: any;
        /**
         * Gets the formatted default NavigationData for this State
         */
        formattedDefaults: any;
        /**
         * Gets the formatted default array NavigationData for this State
         */
        formattedArrayDefaults: { [index: string]: string[]; };
        /**
         * Gets the textual description of the state
         */
        title: string;
        /**
         * Gets the route Url patterns
         */
        route: string | string[];
        /**
         * Gets a value that indicates whether to maintain the crumb trail 
         */
        trackCrumbTrail: boolean;
        /**
         * Gets the crumb trail key
         */
        crumbTrailKey: string;
        /**
         * Gets a value that indicates whether NavigationData Types are
         * preserved when navigating
         */
        trackTypes: boolean;
        /**
         * Gets or sets the StateHandler responsible for building and parsing
         * navigation links to this State
         */
        stateHandler: StateHandler;
        /**
         * Called on the old State before navigating to a different State
         * @param state The new State
         * @param data The new NavigationData
         * @param url The new target location
         * @param unload The function to call to continue to navigate
         * @param history A value indicating whether browser history was used
         */
        unloading: (state: State, data: any, url: string, unload: () => void, history?: boolean) => void;
        /**
         * Called on the old State after navigating to a different State
         */
        dispose: () => void;
        /**
         * Called on the current State after navigating to it
         * @param data The current NavigationData
         * @param asyncData The data passed asynchronously while navigating
         */
        navigated: (data: any, asyncData?: any) => void;
        /**
         * Called on the new State before navigating to it
         * @param data The new NavigationData
         * @param url The new target location
         * @param navigate The function to call to continue to navigate
         * @param history A value indicating whether browser history was used
         */
        navigating: (data: any, url: string, navigate: (asyncData?: any) => void, history: boolean) => void;
    }

    /**
     * Determines the effect on browser history after a successful navigation
     */
    enum HistoryAction {
        /**
         * Creates a new browser history entry
         */
        Add = 0,
        /**
         * Changes the current browser history entry
         */
        Replace = 1,
        /**
         * Leaves browser history unchanged
         */
        None = 2,
    }    

    /**
     * Defines a contract a class must implement in order to manage the browser
     * Url
     */
    interface IHistoryManager {
        /**
         * Gets or sets a value indicating whether to disable browser history
         */
        disabled: boolean;
        /**
         * Registers browser history event listeners
         * @param navigateHistory The history navigation event handler
         */
        init(navigateHistory: () => void): void;
        /**
         * Adds browser history
         * @param url The current url
         * @param replace A value indicating whether to replace the current
         * browser history entry
         */
        addHistory(url: string, replace: boolean): void;
        /**
         * Gets the current location
         */
        getCurrentUrl(): string;
        /**
         * Gets an Href from the url
         */
        getHref(url: string): string;
        /**
         * Gets a Url from the anchor 
         */
        getUrl(anchor: HTMLAnchorElement): string;
        /**
         * Removes browser history event listeners
         */
        stop(): void;
    }

    /**
     * Manages history using the browser Url's hash. If used in a browser
     * without the hashchange event or outside of a browser environment, then
     * history is disabled
     */
    class HashHistoryManager implements IHistoryManager {
        /**
         * Gets or sets a value indicating whether to disable browser history.
         * Set to true if used in a browser without the hashchange event or 
         * outside of a browser environment
         */
        disabled: boolean;
        /**
         * Initializes a new instance of the HashHistoryManager class
         */
        constructor();
        /**
         * Initializes a new instance of the HashHistoryManager class
         * @param replaceQueryIdentifier a value indicating whether to use '#'
         * in place of '?'. Set to true for Internet explorer 6 and 7 support
         */
        constructor(replaceQueryIdentifier: boolean);
        /**
         * Registers a listener for the hashchange event
         * @param navigateHistory The history navigation event handler
         */
        init(navigateHistory: any): void;
        /**
         * Sets the browser Url's hash to the url
         * @param url The current url 
         * @param replace A value indicating whether to replace the current
         * browser history entry
         */
        addHistory(url: string, replace: boolean): void;
        /**
         * Gets the current location
         */
        getCurrentUrl(): string;
        /**
         * Gets an Href from the url
         */
        getHref(url: string): string;
        /**
         * Gets a Url from the anchor 
         */
        getUrl(anchor: HTMLAnchorElement): string;
        /**
         * Removes a listener for the hashchange event
         */
        stop(): void;
    }

    /**
     * Manages history using the HTML5 history api. If used in a browser
     * without the HTML5 history api or outside of a browser environment, then
     * history is disabled
     */
    class HTML5HistoryManager implements IHistoryManager {
        /**
         * Gets or sets a value indicating whether to disable browser history.
         * Set to true if used in a browser without the HTML5 history api or 
         * outside of a browser environment
         */
        disabled: boolean;
        /**
         * Initializes a new instance of the HTML5HistoryManager class
         */
        constructor();
        /**
         * Initializes a new instance of the HTML5HistoryManager class
         * @param applicationPath The application path
         */
        constructor(applicationPath: string);
        /**
         * Registers a listener for the popstate event
         * @param navigateHistory The history navigation event handler
         */
        init(navigateHistory: () => void): void;
        /**
         * Sets the browser Url to the url using pushState
         * @param url The current url 
         * @param replace A value indicating whether to replace the current
         * browser history entry
         */
        addHistory(url: string, replace: boolean): void;
        /**
         * Gets the current location
         */
        getCurrentUrl(): string;
        /**
         * Gets an Href from the url
         */
        getHref(url: string): string;
        /**
         * Gets a Url from the anchor 
         */
        getUrl(anchor: HTMLAnchorElement): string;
        /**
         * Removes a listener for the popstate event
         */
        stop(): void;
    }

    /**
     * Represents one piece of the crumb trail and holds the information need
     * to return to and recreate the State as previously visited
     */
    class Crumb {
        /**
         * Gets the Context Data held at the time of navigating away from this
         * State
         */
        data: any;
        /**
         * Gets the configuration information associated with this navigation
         */
        state: State;
        /**
         * Gets a value indicating whether the Crumb is the last in the crumb
         * trail
         */
        last: boolean;
        /**
         * Gets the State Title
         */
        title: string;
        /**
         * Gets the hyperlink navigation to return to the State and pass the
         * associated Data
         */
        navigationLink: string;
        /**
         * Gets the hyperlink navigation without crumb trail to return to the
         * State and pass the associated Data
         */
        crumblessLink: string;
        /**
         * Initializes a new instance of the Crumb class
         * @param data The Context Data held at the time of navigating away
         * from this State
         * @param state The configuration information associated with this
         * navigation
         * @param link The hyperlink navigation to return to the State and pass
         * the associated Data
         * @param crumblessLink The hyperlink navigation without crumb trail to
         * return to the State and pass the associated Data
         * @param last A value indicating whether the Crumb is the last in the
         * crumb trail
         */
        constructor(data: any, state: State, link: string, crumblessLink: string, last: boolean);
    }

    /**
     * Provides properties for accessing context sensitive navigation
     * information. Holds the current State and NavigationData
     */
    class StateContext {
        /**
         * Gets the last State displayed before the current State
         */
        oldState: State;
        /**
         * Gets the NavigationData for the last displayed State
         */
        oldData: any;
        /**
         * Gets the State of the last Crumb in the crumb trail
         */
        previousState: State;
        /**
         * Gets the NavigationData of the last Crumb in the crumb trail
         */
        previousData: any;
        /**
         * Gets the current State
         */
        state: State;
        /**
         * Gets the NavigationData for the current State
         */
        data: any;
        /**
         * Gets the current Url
         */
        url: string;
        /**
         * Gets or sets the current title
         */
        title: string;
        /**
         * Gets a Crumb collection representing the crumb trail, ordered oldest
         * Crumb first
         */
        crumbs: Crumb[];
        /**
         * Gets the crumb trail
         */
        crumbTrail: string[];
        /**
         * Gets the next crumb
         */
        nextCrumb: Crumb;
        /**
         * Clears the Context Data
         */
        clear(): void;
        /** 
         * Combines the data with all the current NavigationData
         * @param The data to add to the current NavigationData
         * @returns The combined data
         */
        includeCurrentData(data: any): any;
        /** 
         * Combines the data with a subset of the current NavigationData
         * @param The data to add to the current NavigationData
         * @returns The combined data
         */
        includeCurrentData(data: any, keys: string[]): any;
    }

    /**
     * Manages all navigation. These can be forward using an action parameter;
     * backward via a Crumb; or refreshing the current State
     */
    class StateController {
        /**
         * Provides access to context sensitive navigation information
         */
        stateContext: StateContext;
        /**
         * Gets the browser Url manager
         */
        historyManager: IHistoryManager;
        /**
         * Gets a list of States
         */
        states: { [index: string]: State; };
        /**
         * Initializes a new instance of the StateController class
         */
        constructor();
        /**
         * Initializes a new instance of the StateController class
         * @param states A collection of States
         */
        constructor(states: IState[]);
        /**
         * Initializes a new instance of the StateController class
         * @param states A collection of States
         * @param historyManager The manager of the browser Url
         */
        constructor(states: IState[], historyManager: IHistoryManager);
        /**
         * Configures the StateController
         * @param states A collection of States
         */
        configure(states: IState[]): void;
        /**
         * Configures the StateController
         * @param states A collection of States
         * @param historyManager The manager of the browser Url
         */
        configure(states: IState[], historyManager: IHistoryManager): void;
        /**
         * Registers a navigate event listener
         * @param handler The navigate event listener
         */
        onNavigate(handler: (oldState: State, state: State, data: any) => void): void;
        /**
         * Unregisters a navigate event listener
         * @param handler The navigate event listener
         */
        offNavigate(handler: (oldState: State, state: State, data: any) => void): void;
        /**
         * Navigates to a State passing no NavigationData
         * @param state The key of a State
         * @throws state does not match the key of a State or there is 
         * NavigationData that cannot be converted to a String
         * @throws A mandatory route parameter has not been supplied a value
         */
        navigate(state: string): void;
        /**
         * Navigates to a State
         * @param state The key of a State
         * @param toData The NavigationData to be passed to the next State and
         * stored in the StateContext
         * @throws state does not match the key of a State or there is 
         * NavigationData that cannot be converted to a String
         * @throws A mandatory route parameter has not been supplied a value
         */
        navigate(state: string, toData: any): void;
        /**
         * Navigates to a State
         * @param state The key of a State
         * @param toData The NavigationData to be passed to the next State and
         * stored in the StateContext
         * @param A value determining the effect on browser history
         * @throws state does not match the key of a State or there is 
         * NavigationData that cannot be converted to a String
         * @throws A mandatory route parameter has not been supplied a value
         */
        navigate(state: string, toData: any, historyAction: HistoryAction): void;
        /**
         * Gets a Url to navigate to a State passing no NavigationData
         * @param state The key of a State
         * @returns Url that will navigate to State specified in the action
         * @throws state does not match the key of a State or there is 
         * NavigationData that cannot be converted to a String
         */
        getNavigationLink(state: string): string;
        /**
         * Gets a Url to navigate to a State
         * @param state The key of a State
         * @param toData The NavigationData to be passed to the next State and
         * stored in the StateContext
         * @returns Url that will navigate to State specified in the action
         * @throws state does not match the key of a State or there is 
         * NavigationData that cannot be converted to a String
         */
        getNavigationLink(state: string, toData: any): string;
        /**
         * Determines if the distance specified is within the bounds of the
         * crumb trail represented by the Crumbs collection
         */
        canNavigateBack(distance: number): boolean;
        /**
         * Navigates back to the Crumb contained in the crumb trail,
         * represented by the Crumbs collection, as specified by the distance.
         * @param distance Starting at 1, the number of Crumb steps to go back
         * @throws canNavigateBack returns false for this distance
         * @throws A mandatory route parameter has not been supplied a value
         */
        navigateBack(distance: number): void;
        /**
         * Navigates back to the Crumb contained in the crumb trail,
         * represented by the Crumbs collection, as specified by the distance.
         * @param distance Starting at 1, the number of Crumb steps to go back
         * @param A value determining the effect on browser history
         * @throws canNavigateBack returns false for this distance
         * @throws A mandatory route parameter has not been supplied a value
         */
        navigateBack(distance: number, historyAction: HistoryAction): void;
        /**
         * Gets a Url to navigate to a Crumb contained in the crumb trail, 
         * represented by the Crumbs collection, as specified by the distance.
         * @param distance Starting at 1, the number of Crumb steps to go back
         * @throws canNavigateBack returns false for this distance
         */
        getNavigationBackLink(distance: number): string;
        /**
         * Navigates to the current State passing no NavigationData
         * @throws A mandatory route parameter has not been supplied a value
         */
        refresh(): void;
        /**
         * Navigates to the current State
         * @param toData The NavigationData to be passed to the current State
         * and stored in the StateContext
         * @throws There is NavigationData that cannot be converted to a String
         * @throws A mandatory route parameter has not been supplied a value
         */
        refresh(toData: any): void;
        /**
         * Navigates to the current State
         * @param toData The NavigationData to be passed to the current State
         * and stored in the StateContext
         * @param A value determining the effect on browser history
         * @throws There is NavigationData that cannot be converted to a String
         * @throws A mandatory route parameter has not been supplied a value
         */
        refresh(toData: any, historyAction: HistoryAction): void;
        /**
         * Gets a Url to navigate to the current State passing no 
         * NavigationData
         */
        getRefreshLink(): string;
        /**
         * Gets a Url to navigate to the current State
         * @param toData The NavigationData to be passed to the current State
         * and stored in the StateContext
         * @returns Url that will navigate to the current State
         * @throws There is NavigationData that cannot be converted to a String
         */
        getRefreshLink(toData: any): string;
        /**
         * Navigates to the url
         * @param url The target location
         */
        navigateLink(url: string): void;
        /**
         * Navigates to the url
         * @param url The target location
         * @param A value determining the effect on browser history
         */
        navigateLink(url: string, historyAction: HistoryAction): void;
        /**
         * Navigates to the url
         * @param url The target location
         * @param A value determining the effect on browser history
         * @param history A value indicating whether browser history was used
         */
        navigateLink(url: string, historyAction: HistoryAction, history: boolean): void;
        /**
         * Parses the url out into State and Navigation Data
         * @param url The url to parse
         */
        parseLink(url: string): { state: State; data: any; };
        /**
         * Navigates to the current location 
         */
        start(): void;
        /**
         * Navigates to the passed in url
         * @param url The url to navigate to 
         */
        start(url: string): void;
    }

    /**
     * Builds and parses navigation links
     */
    class StateHandler {
        /**
         * Gets a link that navigates to the state passing the data
         * @param router The builder and parser of State routes
         * @param state The State to navigate to
         * @param data The data to pass when navigating
         * @param arrayData The query string and splat array data
         * @returns The navigation link
         */
        getNavigationLink(router: IRouter, state: State, data: any, arrayData: { [index: string]: string[]; }): string;
        /**
         * Navigates to the url
         * @param oldState The current State
         * @param state The State to navigate to
         * @param url The target location
         */
        navigateLink(oldState: State, state: State, url: string): void;
        /**
         * Gets the data parsed from the url
         * @param router The builder and parser of State routes
         * @param state The State navigated to
         * @param url The current url
         * @returns The navigation data and query string and splat keys
         */
        getNavigationData(router: IRouter, state: State, url: string): { data: any; separableData: any; };
        /**
         * Encodes the Url value
         * @param state The State navigated to
         * @param key The key of the navigation data item
         * @param val The Url value of the navigation data item
         * @param queryString A value indicating the Url value's location
         */
        urlEncode(state: State, key: string, val: string, queryString: boolean): string;
        /**
         * Decodes the Url value
         * @param state The State navigated to
         * @param key The key of the navigation data item
         * @param val The Url value of the navigation data item
         * @param queryString A value indicating the Url value's location
         */
        urlDecode(state: State, key: string, val: string, queryString: boolean): string;
        /**
         * Truncates the crumb trail whenever a repeated or initial State is
         * encountered
         * @param The State navigated to
         * @param The Crumb collection representing the crumb trail
         * @returns Truncated crumb trail
         */
        truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[];
    }

    /**
     * Defines a contract a class must implement in order build and parse
     * State routes
     */
    interface IRouter {
        /**
         * Gets the matching State and data for the route
         * @param route The route to match
         * @returns The matched State and data and splat keys
         */
        getData(route: string): { state: State; data: any; separableData: any; };
        /**
         * Gets the matching route and data for the state and data
         * @param The state to match
         * @param The data to match
         * @param arrayData The splat array data
         * @returns The matched route and data
         */
        getRoute(state: State, data: any, arrayData: { [index: string]: string[]; }): { route: string; data: any; };
        /**
         * Registers all route configuration information
         * @param states Collection of States
         */
        addRoutes(states: State[]): void;
    }
}