var Navigation = require('navigation');
var StateInfo = require('./StateInfo');
var StateNavigator = require('./StateNavigator');

StateInfo.configureStateInfo();
StateNavigator.configureStateNavigator();
Navigation.start();

if (module.hot) {
    module.hot.accept(['./StateInfo', './StateNavigator'], function() {
        try {
            require('./StateInfo').configureStateInfo();
        } catch(e) {
            console.error(e.message);
            return;
        }
        require('./StateNavigator').configureStateNavigator();
        function reloadContext(stateProp, dialogProp) {
            var state = Navigation.StateContext[stateProp];
            if (state) {
                var dialog = Navigation.StateInfoConfig.dialogs[state.parent.key];
                Navigation.StateContext[stateProp] = dialog.states[state.key];
                Navigation.StateContext[dialogProp] = dialog;
            }
        }
        reloadContext('state', 'dialog');
        reloadContext('oldState', 'oldDialog');
        reloadContext('previousState', 'previousDialog');
        var currentData = Navigation.StateContext.includeCurrentData({});
        Navigation.StateController.refresh(currentData);
    });
}