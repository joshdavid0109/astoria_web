import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeLogoSmash = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    /* ================= BASIC SETUP ================= */
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.8, 6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(220, 220);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    mountRef.current.appendChild(renderer.domElement);

    /* ================= LIGHTING ================= */
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(2, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    /* ================= LOGO ================= */
    const texture = new THREE.TextureLoader().load(
      "src/assets/Astoria_Logo_gray-nobg.png"
    );

    const logoMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      roughness: 0.4,
      metalness: 0.05,
    });

    // Fake extrusion by stacking planes
    const logoGroup = new THREE.Group();

    for (let i = 0; i < 6; i++) {
      const layer = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 3),
        logoMaterial
      );
      layer.position.z = -i * 0.015;
      layer.castShadow = true;
      logoGroup.add(layer);
    }

    logoGroup.position.y = 4;
    scene.add(logoGroup);

    /* ================= GROUND ================= */
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.ShadowMaterial({ opacity: 0.2 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ================= IMPACT RING ================= */
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.45, 48),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.25,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.visible = false;
    scene.add(ring);

    /* ================= ANIMATION STATE ================= */
    let velocity = 0;
    const gravity = 0.018;
    let impact = false;
    let shake = 0.15;

    const animate = () => {
      if (!mountRef.current) return;

      requestAnimationFrame(animate);

      if (!impact) {
        velocity += gravity;
        logoGroup.position.y -= velocity;

        if (logoGroup.position.y <= 0.6) {
          logoGroup.position.y = 0.6;
          velocity *= -0.25;
          impact = true;

          // squash
          logoGroup.scale.set(1.15, 0.85, 1);

          // ring
          ring.visible = true;
          ring.scale.set(0.5, 0.5, 0.5);
          ring.material.opacity = 0.35;
        }
      } else {
        logoGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.12);

        // ring expand
        if (ring.visible) {
          ring.scale.multiplyScalar(1.06);
          ring.material.opacity *= 0.9;
          if (ring.material.opacity < 0.02) ring.visible = false;
        }
      }

      // camera shake decay
      if (shake > 0.001) {
        camera.position.x = (Math.random() - 0.5) * shake;
        camera.position.y = 0.8 + (Math.random() - 0.5) * shake;
        shake *= 0.9;
      }

      renderer.render(scene, camera);
    };

    animate();

    /* ================= CLEANUP ================= */
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeLogoSmash;
