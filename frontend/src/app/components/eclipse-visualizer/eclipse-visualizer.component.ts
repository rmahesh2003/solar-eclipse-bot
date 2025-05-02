import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import * as L from 'leaflet';
import * as THREE from 'three';

@Component({
  selector: 'app-eclipse-visualizer',
  templateUrl: './eclipse-visualizer.component.html',
  styleUrls: ['./eclipse-visualizer.component.scss']
})
export class EclipseVisualizerComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('simulationContainer') simulationContainer!: ElementRef;
  
  private map!: L.Map;
  private simulationScene!: THREE.Scene;
  private simulationCamera!: THREE.PerspectiveCamera;
  private simulationRenderer!: THREE.WebGLRenderer;
  private sun!: THREE.Mesh;
  private moon!: THREE.Mesh;
  private earth!: THREE.Mesh;
  
  currentLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  eclipseData: any;
  simulationTime: Date = new Date();
  isSimulationRunning: boolean = false;
  
  constructor(
    private http: HttpClient,
    private socket: Socket
  ) {}
  
  ngOnInit(): void {
    this.initializeMap();
    this.initializeSimulation();
    this.setupSocketListeners();
  }
  
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
    if (this.simulationRenderer) {
      this.simulationRenderer.dispose();
    }
  }
  
  private initializeMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.currentLocation = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };
      this.calculateEclipse();
    });
  }
  
  private initializeSimulation(): void {
    // Create scene
    this.simulationScene = new THREE.Scene();
    
    // Create camera
    this.simulationCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.simulationCamera.position.z = 5;
    
    // Create renderer
    this.simulationRenderer = new THREE.WebGLRenderer();
    this.simulationRenderer.setSize(
      this.simulationContainer.nativeElement.clientWidth,
      this.simulationContainer.nativeElement.clientHeight
    );
    this.simulationContainer.nativeElement.appendChild(this.simulationRenderer.domElement);
    
    // Create celestial bodies
    this.createCelestialBodies();
    
    // Start animation loop
    this.animate();
  }
  
  private createCelestialBodies(): void {
    // Create sun
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.simulationScene.add(this.sun);
    
    // Create moon
    const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
    this.simulationScene.add(this.moon);
    
    // Create earth
    const earthGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    this.simulationScene.add(this.earth);
  }
  
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    
    if (this.isSimulationRunning) {
      // Update positions based on current time
      this.updateCelestialPositions();
    }
    
    this.simulationRenderer.render(this.simulationScene, this.simulationCamera);
  }
  
  private updateCelestialPositions(): void {
    // Update positions based on current simulation time
    // This is a simplified version - actual calculations would use astronomical formulas
    const time = this.simulationTime.getTime();
    const moonOrbitRadius = 2;
    const moonOrbitPeriod = 27.3 * 24 * 60 * 60 * 1000; // 27.3 days in milliseconds
    
    this.moon.position.x = moonOrbitRadius * Math.cos(2 * Math.PI * time / moonOrbitPeriod);
    this.moon.position.y = moonOrbitRadius * Math.sin(2 * Math.PI * time / moonOrbitPeriod);
  }
  
  private setupSocketListeners(): void {
    this.socket.fromEvent('eclipse-update').subscribe((data: any) => {
      this.eclipseData = data;
      this.updateSimulation();
    });
  }
  
  private calculateEclipse(): void {
    this.http.post('http://localhost:5000/api/calculate-eclipse', {
      latitude: this.currentLocation.lat,
      longitude: this.currentLocation.lng,
      date: this.simulationTime.toISOString().split('T')[0]
    }).subscribe(
      (response: any) => {
        this.eclipseData = response;
        this.updateSimulation();
      },
      (error) => {
        console.error('Error calculating eclipse:', error);
      }
    );
  }
  
  private updateSimulation(): void {
    if (this.eclipseData) {
      // Update simulation based on eclipse data
      // This would include adjusting the positions of the celestial bodies
      // and updating the visualization
    }
  }
  
  toggleSimulation(): void {
    this.isSimulationRunning = !this.isSimulationRunning;
  }
  
  setSimulationTime(time: Date): void {
    this.simulationTime = time;
    this.calculateEclipse();
  }
} 