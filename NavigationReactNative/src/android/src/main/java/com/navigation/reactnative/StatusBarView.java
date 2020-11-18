package com.navigation.reactnative;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.util.TypedValue;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.core.view.ViewCompat;

import com.facebook.react.bridge.ReactContext;

public class StatusBarView extends ViewGroup {
    int barTintColor;
    int defaultStatusBarColor;

    public StatusBarView(Context context) {
        super(context);
        TypedValue typedValue = new TypedValue();
        context.getTheme().resolveAttribute(R.attr.colorPrimaryDark, typedValue, true);
        barTintColor = defaultStatusBarColor = typedValue.data;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        ViewParent ancestor = getParent();
        while (ancestor != null && !(ancestor instanceof SceneView))
            ancestor = ancestor.getParent();
        if (ancestor == null)
            return;
        SceneView scene = (SceneView) ancestor;
        scene.statusBar = true;
        updateStatusBar();
    }

    void onAfterUpdateTransaction() {
        if (ViewCompat.isAttachedToWindow(this))
            updateStatusBar();
    }

    private void updateStatusBar() {
        Activity activity = ((ReactContext) getContext()).getCurrentActivity();
        if (activity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            activity.getWindow().setStatusBarColor(barTintColor);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}