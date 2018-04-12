import NavigationHandler from './NavigationHandler';
import { StateNavigator, StateContext, HTML5HistoryManager, State } from 'navigation';
import * as ReactDOM from 'react-dom';

class AsyncStateNavigator extends StateNavigator {
    private navigationHandler: NavigationHandler;
    private stateNavigator: StateNavigator;

    constructor(navigationHandler: NavigationHandler, stateNavigator: StateNavigator, stateContext: StateContext) {
        var inertHistoryManager = new HTML5HistoryManager();
        inertHistoryManager.init = () => {};
        super(stateNavigator, inertHistoryManager);
        this.navigationHandler = navigationHandler;
        this.stateNavigator = stateNavigator;
        this.stateContext = stateContext;
        this.historyManager = stateNavigator.historyManager;
        this.configure = stateNavigator.configure.bind(stateNavigator);
        this.onBeforeNavigate = stateNavigator.onBeforeNavigate.bind(stateNavigator);
        this.offBeforeNavigate = stateNavigator.offBeforeNavigate.bind(stateNavigator);
        this.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
        this.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
    }

    navigate(stateKey: string, navigationData?: any, historyAction?: 'add' | 'replace' | 'none', defer?: boolean) {
        var url = this.getNavigationLink(stateKey, navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction, false, undefined, defer);
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
        suspendNavigation: (stateContext: StateContext, resumeNavigation: () => void) => void = (_, resumeNavigation) => resumeNavigation(), defer = false) {
        this.stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
            suspendNavigation(stateContext, () => {
                var asyncNavigator = new AsyncStateNavigator(this.navigationHandler, this.stateNavigator, stateContext);
                this.suspendNavigation(asyncNavigator, resumeNavigation, defer);
            })
        });
    }

    private suspendNavigation(asyncNavigator: AsyncStateNavigator, resumeNavigation: () => void, defer: boolean) {
        defer = defer && ReactDOM.unstable_deferredUpdates;
        var { oldState, oldUrl, state, data, url, asyncData } = asyncNavigator.stateContext;
        if (defer)
            this.navigationHandler.setState(({ context }) => {
                if (oldUrl === context.stateNavigator.stateContext.url)
                    return { context: { ...context, nextState: state, nextData: data } };
                return null;
            });
        var wrapDefer = setState => defer ? ReactDOM.unstable_deferredUpdates(() => setState()) : setState();
        wrapDefer(() => {
            this.navigationHandler.setState(() => (
                { context: { oldState, state, data, asyncData, nextState: null, nextData: {}, stateNavigator: asyncNavigator } }
            ), () => {
                if (this.navigationHandler.state.context.stateNavigator.stateContext.url === url)
                    resumeNavigation();
            });
        });
    }
}
export default AsyncStateNavigator;