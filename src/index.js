import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSpring, animated } from 'react-spring';

import './styles.css';

const trans = (x, y, z) => ({
  transform: `rotateY(-20deg) translateX(${x}px) translateY(${y}px) translateZ(${z}px)`
});

function App({ arr }) {
  const [orders, setOrders] = useState(arr.map((_, i) => i));
  const [targetImg, setTargetImg] = useState();

  const shouldFlip = useRef();

  shouldFlip.current = false;

  function next() {
    console.log('next called');
    setOrders(orders.map(i => (i + 1) % arr.length));
  }

  useEffect(() => {
    console.log('new order', orders);
    console.log('should flip');
  }, [orders]);

  useEffect(() => {
    if (targetImg > -1) {
      if (orders[targetImg] === 0) {
        console.log('target on front');
      } else {
        shouldFlip.current = orders[targetImg] !== arr.length;
        setTimeout(() => {
          next();
        }, 400);
      }
    }
  }, [targetImg, orders]);

  const slide = order =>
    useSpring({
      to: async next => {
        if (order === 0) {
          const goUp = -450 - (arr.length - 3) * 30;
          const o = arr.length;
          if (shouldFlip.current) {
            await next(trans(o * -30, goUp, o * 10));
          }
          await next(trans(o * -30, o * +30, o * 10));
        }
        if (order > 0) {
          const o = order;
          await next(trans(-28 * o, 28 * o, 10.4 * o));
          await next(trans(-30 * o, 30 * o, 10 * o));
        }
      },
      from: trans(50, -50, 0)
    });

  return (
    <div className="wrapper">
      {arr.map((img, i) => (
        <animated.div key={`img${i}`} style={slide(orders[i])}>
          <div
            className="container1 container"
            style={{ backgroundImage: `url(${arr[i]})` }}
          >
            i: {i} - order: {orders[i]}
          </div>
        </animated.div>
      ))}
      <button onClick={() => setTargetImg(1)}>Go to 1</button>
      <button onClick={() => setTargetImg(2)}>Go to 2</button>
      <button onClick={() => setTargetImg(0)}>Go to 0</button>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(
  <App
    arr={[
      'https://cdn.dribbble.com/users/989466/screenshots/6493524/uniblitz-application-icons-dribbble-alex-pasquarella_2x.png',
      'https://cdn.dribbble.com/users/1626229/screenshots/6467647/the-wind-of-change.jpg',
      'https://cdn.dribbble.com/users/15687/screenshots/6480282/hovercar-drib_2x.png'
    ]}
  />,
  rootElement
);
