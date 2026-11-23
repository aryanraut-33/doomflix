import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CubeProps {
  size?: number;
  interactive?: boolean;
  className?: string;
}

export const GeometricCube: React.FC<CubeProps> = ({ size = 180, interactive = true, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Group to hold the nested cubes
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Outer Wireframe Metallic Cube (Doom Incursion Frame)
    const outerGeo = new THREE.BoxGeometry(1.9, 1.9, 1.9);
    const edges = new THREE.EdgesGeometry(outerGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xF0141E,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const wireframeCube = new THREE.LineSegments(edges, lineMat);
    rootGroup.add(wireframeCube);

    // 2. Inner Sacred Timeline Core Cube (Gold/Emerald)
    const innerGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x151922,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x9e0d14,
      emissiveIntensity: 0.4,
      wireframe: false,
    });
    const innerCube = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerCube);

    // 3. Central Quantum Singularity (glowing point)
    const coreGeo = new THREE.OctahedronGeometry(0.5, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xF0141E, 4, 10);
    redLight.position.set(2, 3, 2);
    scene.add(redLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 3, 10);
    goldLight.position.set(-2, -2, 2);
    scene.add(goldLight);

    // Interaction handling
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.3;
    let targetRotationY = 0.6;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive || !isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation
      if (!isDragging) {
        targetRotationY += 0.008;
        targetRotationX = 0.25 + Math.sin(elapsedTime * 0.5) * 0.15;
      }

      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.1;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.1;

      // Inner counter-rotation
      innerCube.rotation.y -= 0.012;
      innerCube.rotation.x += 0.008;
      coreMesh.rotation.z += 0.02;

      // Subtle pulse
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.04;
      coreMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (mount.contains(dom)) {
        mount.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [size, interactive]);

  return (
    <div 
      ref={mountRef} 
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ width: size, height: size }}
      title="The Chronal Cube: Multiverse Convergence Singularity (Drag to rotate)"
    />
  );
};
