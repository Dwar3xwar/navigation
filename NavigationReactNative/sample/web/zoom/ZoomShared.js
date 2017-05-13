import React from 'react';
import SharedElementMotion from '../SharedElementMotion';

export default (props) => (
  <SharedElementMotion
    {...props}
    elementStyle={(name, data) => data}
    style={styles.motion}
    onAnimating={(name, ref) => {ref.setNativeProps({style:{opacity: 0}})}}
    onAnimated={(name, ref) => {ref.setNativeProps({style:{opacity: 1}})}}>
    {({x, y, w, h, fontSize, fontColor}, name, {color}) => (
      !name.startsWith('text') ? <View
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundColor: color,
        }}>
      </View> : <Text          
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          fontSize,
          textAlign: 'center',
          fontWeight: 'bold',
          color: fontColor,
          zIndex: 1,
        }}>
          {color}
        </Text>
    )}
  </SharedElementMotion>
);

const styles = {
  motion: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
};

