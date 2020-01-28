package com.navigation.reactnative;

import android.content.Context;
import android.view.MenuItem;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;

import androidx.appcompat.widget.SearchView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

public class SearchBarView extends ReactViewGroup {
    SearchView searchView;
    int nativeEventCount;
    int mostRecentEventCount;

    public SearchBarView(Context context) {
        super(context);
        searchView = new SearchView(context);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                nativeEventCount++;
                WritableMap event = Arguments.createMap();
                event.putString("text", newText);
                event.putInt("eventCount", nativeEventCount);
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onChangeText", event);
                return false;
            }
        });
    }

    void setQuery(String query) {
        int eventLag = nativeEventCount - mostRecentEventCount;
        if (eventLag == 0 && !searchView.getQuery().toString().equals(query))
            searchView.setQuery(query, true);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        ViewGroup view = (ViewGroup) getParent();
        ToolbarView toolbarView = null;
        if (searchView.requestFocusFromTouch()) {
            InputMethodManager inputMethodManager = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
            if (inputMethodManager != null)
                inputMethodManager.showSoftInput(searchView.findFocus(), 0);
        }
        for(int i = 0; i < view.getChildCount(); i++) {
            if (view.getChildAt(i) instanceof  CoordinatorLayoutView)
                view = (CoordinatorLayoutView) view.getChildAt(i);
        }
        for(int i = 0; i < view.getChildCount(); i++) {
            if (view.getChildAt(i) instanceof NavigationBarView) {
                NavigationBarView navigationBarView = (NavigationBarView) view.getChildAt(i);
                for (int j = 0; j < navigationBarView.getChildCount(); j++) {
                    if (navigationBarView.getChildAt(j) instanceof ToolbarView)
                        toolbarView = (ToolbarView) navigationBarView.getChildAt(j);
                }
            }
        }
        if (toolbarView != null) {
            toolbarView.setOnSearchListener(new ToolbarView.OnSearchListener() {
                @Override
                public void onSearchAdd(MenuItem searchMenuItem) {
                    searchMenuItem.setActionView(searchView);
                }

                @Override
                public void onSearchExpand() {
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onExpand", null);
                }

                @Override
                public void onSearchCollapse() {
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onCollapse", null);
                }
            });
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
