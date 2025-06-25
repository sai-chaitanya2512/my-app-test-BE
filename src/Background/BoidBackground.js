// src/components/BoidBackground.js
import { useEffect, useRef } from 'react';
import paper, { Path, Point, Shape, Tool } from 'paper';

const BoidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    paper.setup(canvas);


    let boids = [];
    let groupTogether = false;

    // Heart path
    // const starPath = new Path('M27.865 31.83 L17.615 26.209 L7.462 32.009 L9.553 20.362 L0.99 12.335 L12.532 10.758 L17.394 0 L22.436 10.672 L34 12.047 L25.574 20.22 Z');
    const heartPath = new Path('M514.69629,624.70313c-7.10205,-27.02441 -17.2373,-52.39453 -30.40576,-76.10059c-13.17383,-23.70703 -38.65137,-60.52246 -76.44434,-110.45801c-27.71631,-36.64355 -44.78174,-59.89355 -51.19189,-69.74414c-10.5376,-16.02979 -18.15527,-30.74951 -22.84717,-44.14893c-4.69727,-13.39893 -7.04297,-26.97021 -7.04297,-40.71289c0,-25.42432 8.47119,-46.72559 25.42383,-63.90381c16.94775,-17.17871 37.90527,-25.76758 62.87354,-25.76758c25.19287,0 47.06885,8.93262 65.62158,26.79834c13.96826,13.28662 25.30615,33.10059 34.01318,59.4375c7.55859,-25.88037 18.20898,-45.57666 31.95215,-59.09424c19.00879,-18.32178 40.99707,-27.48535 65.96484,-27.48535c24.7373,0 45.69531,8.53564 62.87305,25.5957c17.17871,17.06592 25.76855,37.39551 25.76855,60.98389c0,20.61377 -5.04102,42.08691 -15.11719,64.41895c-10.08203,22.33203 -29.54687,51.59521 -58.40723,87.78271c-37.56738,47.41211 -64.93457,86.35352 -82.11328,116.8125c-13.51758,24.0498 -23.82422,49.24902 -30.9209,75.58594z');
    heartPath.strokeColor = null;

    function Boid(position, maxSpeed, maxForce) {
      const strength = Math.random() * 0.5;
      this.acceleration = new Point();
      this.vector = Point.random().multiply(2).subtract(1);
      this.position = position.clone();
      this.radius = 30;
      this.maxSpeed = maxSpeed + strength;
      this.maxForce = maxForce + strength;
      this.amount = strength * 10 + 10;
      this.count = 0;

      this.head = new Shape.Ellipse({
        center: [0, 0],
        size: [13, 8],
        fillColor: 'white'
      });

      this.path = new Path({
        strokeColor: 'white',
        strokeWidth: 2,
        strokeCap: 'round'
      });

      this.shortPath = new Path({
        strokeColor: 'white',
        strokeWidth: 4,
        strokeCap: 'round'
      });

      for (let i = 0; i < this.amount; i++) {
        this.path.add(new Point());
        if (i < 3) this.shortPath.add(new Point());
      }

      this.run = (boids) => {
        this.lastLoc = this.position.clone();
        if (!groupTogether) this.flock(boids);
        else this.align(boids);
        this.borders();
        this.update();
        this.calculateTail();
        this.moveHead();
      };

      this.calculateTail = () => {
        const segments = this.path.segments;
        const shortSegments = this.shortPath.segments;
        const speed = this.vector.length;
        const pieceLength = 5 + speed / 3;
        let point = this.position;
        segments[0].point = shortSegments[0].point = point;
        let lastVector = this.vector.negate();
        for (let i = 1; i < this.amount; i++) {
          let vector = segments[i].point.subtract(point);
          this.count += speed * 10;
          const wave = Math.sin((this.count + i * 3) / 300);
          const sway = lastVector.rotate(90).normalize(wave);
          point = point.add(lastVector.normalize(pieceLength)).add(sway);
          segments[i].point = point;
          if (i < 3) shortSegments[i].point = point;
          lastVector = vector;
        }
        this.path.smooth();
      };

      this.moveHead = () => {
        this.head.position = this.position;
        this.head.rotation = this.vector.angle;
      };

      this.flock = (boids) => {
        const separation = this.separate(boids).multiply(3);
        const alignment = this.align(boids);
        const cohesion = this.cohesion(boids);
        this.acceleration = this.acceleration.add(separation).add(alignment).add(cohesion);
      };

      this.update = () => {
        this.vector = this.vector.add(this.acceleration);
        this.vector.length = Math.min(this.maxSpeed, this.vector.length);
        this.position = this.position.add(this.vector);
        this.acceleration = new Point();
      };

      this.seek = (target) => {
        this.acceleration = this.acceleration.add(this.steer(target, false));
      };

      this.arrive = (target) => {
        this.acceleration = this.acceleration.add(this.steer(target, true));
      };

      this.borders = () => {
        const vector = new Point();
        const pos = this.position;
        const size = paper.view.size;
        if (pos.x < -this.radius) vector.x = size.width + this.radius;
        if (pos.y < -this.radius) vector.y = size.height + this.radius;
        if (pos.x > size.width + this.radius) vector.x = -size.width - this.radius;
        if (pos.y > size.height + this.radius) vector.y = -size.height - this.radius;
        if (!vector.isZero()) {
          this.position = this.position.add(vector);
          for (let i = 0; i < this.amount; i++) {
            this.path.segments[i].point = this.path.segments[i].point.add(vector);
          }
        }
      };

      this.steer = (target, slowdown) => {
        let steer;
        const desired = target.subtract(this.position);
        const dist = desired.length;
        if (slowdown && dist < 100) {
          desired.length = this.maxSpeed * (dist / 100);
        } else {
          desired.length = this.maxSpeed;
        }
        steer = desired.subtract(this.vector);
        steer.length = Math.min(this.maxForce, steer.length);
        return steer;
      };

      this.separate = (boids) => {
        const desiredSeparation = 60;
        let steer = new Point();
        let count = 0;
        for (const other of boids) {
          const diff = this.position.subtract(other.position);
          const d = diff.length;
          if (d > 0 && d < desiredSeparation) {
            steer = steer.add(diff.normalize(1 / d));
            count++;
          }
        }
        if (count > 0) steer = steer.divide(count);
        if (!steer.isZero()) {
          steer.length = this.maxSpeed;
          steer = steer.subtract(this.vector);
          steer.length = Math.min(this.maxForce, steer.length);
        }
        return steer;
      };

      this.align = (boids) => {
        const neighborDist = 25;
        let steer = new Point();
        let count = 0;
        for (const other of boids) {
          const d = this.position.getDistance(other.position);
          if (d > 0 && d < neighborDist) {
            steer = steer.add(other.vector);
            count++;
          }
        }
        if (count > 0) steer = steer.divide(count);
        if (!steer.isZero()) {
          steer.length = this.maxSpeed;
          steer = steer.subtract(this.vector);
          steer.length = Math.min(this.maxForce, steer.length);
        }
        return steer;
      };

      this.cohesion = (boids) => {
        const neighborDist = 100;
        let sum = new Point();
        let count = 0;
        for (const other of boids) {
          const d = this.position.getDistance(other.position);
          if (d > 0 && d < neighborDist) {
            sum = sum.add(other.position);
            count++;
          }
        }
        if (count > 0) {
          sum = sum.divide(count);
          return this.steer(sum, false);
        }
        return sum;
      };
    }

    for (let i = 0; i < 30; i++) {
      const position = Point.random().multiply(paper.view.size);
      boids.push(new Boid(position, 10, 0.05));
    }

    paper.view.onFrame = (event) => {
      for (let i = 0; i < boids.length; i++) {
        if (groupTogether) {
          const len = ((i + event.count / 30) % boids.length) / boids.length * heartPath.length;
          const point = heartPath.getPointAt(len);
          if (point) boids[i].arrive(point);
        }
        boids[i].run(boids);  
      }
    };

    paper.view.onResize = () => {
      heartPath.fitBounds(paper.view.bounds);
      heartPath.scale(0.8);
    };
    
    paper.view.onMouseDown = (event) => {
      heartPath.fitBounds(paper.view.bounds);
      heartPath.scale(0.8);
      groupTogether = !groupTogether;
    };

    return () => {
      paper.project.clear();
    };
  }, []);


  return (
    <canvas
      ref={canvasRef}
      resize="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: 'black',
      }}
    />
  );
};

export default BoidBackground;