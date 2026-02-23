import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas   = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 7;

    const knotMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.8, 0.5, 180, 28),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.052 })
    );
    knotMesh.position.set(4.2, -0.5, -2);
    scene.add(knotMesh);

    const icoMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.4, 1),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.042 })
    );
    icoMesh.position.set(-4.5, 1.2, -2.5);
    scene.add(icoMesh);

    const octMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.9, 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.038 })
    );
    octMesh.position.set(0, 3.8, -4);
    scene.add(octMesh);

    const N = 2800;
    const pPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 52;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 42;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const stars = new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.017, transparent: true, opacity: 0.42, sizeAttenuation: true })
    );
    scene.add(stars);

    let cTx = 0, cTy = 0;
    let cNx = 0, cNy = 0;

    const onMouseMove = (e) => {
      cNx = (e.clientX / window.innerWidth  - 0.5) * 2;
      cNy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let rafId;
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      knotMesh.rotation.x = t * 0.11; knotMesh.rotation.y = t * 0.19;
      icoMesh.rotation.x  = t * 0.16; icoMesh.rotation.y  = -t * 0.12;
      octMesh.rotation.x  = t * 0.09; octMesh.rotation.z  = t * 0.07;
      stars.rotation.y    = t * 0.010; stars.rotation.x   = t * 0.005;
      cTx += (cNx * 0.85 - cTx) * 0.032;
      cTy += (-cNy * 0.52 - cTy) * 0.032;
      camera.position.x = cTx; camera.position.y = cTy;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
    />
  );
}
