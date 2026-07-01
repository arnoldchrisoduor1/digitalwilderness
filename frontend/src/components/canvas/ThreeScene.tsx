"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let w = mount.clientWidth;
    let h = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0x2be8c8,
      transparent: true,
      opacity: 0.85,
    });
    const core = new THREE.LineSegments(coreEdges, coreMat);
    group.add(core);

    const innerGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x8b7cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    group.add(inner);

    const nodeCount = 26;
    const nodes: {
      mesh: THREE.Mesh;
      radius: number;
      theta: number;
      phi: number;
      speed: number;
    }[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);

    for (let i = 0; i < nodeCount; i++) {
      const color = [0x2be8c8, 0xffb15c, 0x8b7cf6][i % 3];
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      const radius = 2.3 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      nodes.push({
        mesh,
        radius,
        theta,
        phi,
        speed: (Math.random() * 0.4 + 0.15) * (Math.random() < 0.5 ? 1 : -1),
      });
      scene.add(mesh);
    }

    const linkMat = new THREE.LineBasicMaterial({
      color: 0x2be8c8,
      transparent: true,
      opacity: 0.12,
    });
    const linkGeo = new THREE.BufferGeometry();
    const linkPositions = new Float32Array(nodeCount * 2 * 3);
    linkGeo.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
    scene.add(new THREE.LineSegments(linkGeo, linkMat));

    let dragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotY = 0.3;
    let rotX = -0.15;
    let autoRotate = true;
    let animId = 0;
    const clock = new THREE.Clock();

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      autoRotate = false;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      rotY += dx * 0.006;
      rotX += dy * 0.006;
      rotX = Math.max(-1.1, Math.min(1.1, rotX));
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const resize = () => {
      w = mount.clientWidth;
      h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (autoRotate) rotY += dt * 0.15;

      group.rotation.y = rotY;
      group.rotation.x = rotX;
      inner.rotation.y -= dt * 0.3;
      inner.rotation.x += dt * 0.15;

      nodes.forEach((n, i) => {
        n.theta += dt * n.speed * 0.5;
        const x = n.radius * Math.sin(n.phi) * Math.cos(n.theta);
        const y = n.radius * Math.cos(n.phi);
        const z = n.radius * Math.sin(n.phi) * Math.sin(n.theta);

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        let rx = x * cosY + z * sinY;
        let rz = -x * sinY + z * cosY;
        const ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;

        n.mesh.position.set(rx, ry, rz);

        if (i % 3 === 0) {
          const idx = i * 6;
          linkPositions[idx] = 0;
          linkPositions[idx + 1] = 0;
          linkPositions[idx + 2] = 0;
          linkPositions[idx + 3] = rx;
          linkPositions[idx + 4] = ry;
          linkPositions[idx + 5] = rz;
        }
      });
      linkGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      aria-hidden
    />
  );
}
