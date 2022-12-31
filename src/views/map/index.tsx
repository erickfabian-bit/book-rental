import { useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';

import Home from '@arcgis/core/widgets/Home';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';

import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import Sketch from '@arcgis/core/widgets/Sketch';

import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import LayerList from '@arcgis/core/widgets/LayerList';

import '@arcgis/core/assets/esri/themes/light/main.css';

const index = (): JSX.Element => {
	const mapContainer = useRef<HTMLDivElement>(null);
	const [sketchViewModel, setSketchViewModel] = useState<SketchViewModel>();
	const [graphicsLayer, setGraphicsLayer] = useState<GraphicsLayer>(
		new GraphicsLayer({
			title: 'Polígono',
		}),
	);

	useEffect(() => {
		const sketchGraphicsLayer = new GraphicsLayer({
			title: 'Sketch',
		});

		const graphicsLayer = new GraphicsLayer({
			title: 'Poligono',
		});

		const layer = new FeatureLayer({
			// URL to the service
			url: 'http://servicios.geojaz.com:6080/arcgis/rest/services/ICL_PRUEBAS/ICL_SERVICIOS_CAPAS_3_3_ACTUALIZADO/MapServer/3',
		});

		const webMap = new WebMap({
			basemap: 'topo-vector',
			layers: [sketchGraphicsLayer, graphicsLayer, layer],
		});

		const mapView = new MapView({
			map: webMap,
			extent: {
				xmin: -8581444.0255,
				ymin: -1354798.8354,
				xmax: -8571798.9398,
				ymax: -1349292.8537,
				spatialReference: {
					wkid: 3857,
				},
			},
			zoom: 14,
			container: mapContainer.current as unknown as HTMLDivElement,
		});

		// Draw
		const sketchViewModel = new SketchViewModel({
			view: mapView,
			layer: graphicsLayer,
			updateOnGraphicClick: false,
			defaultUpdateOptions: {
				toggleToolOnClick: false,
			},
		});
		const sketch = new Sketch({
			view: mapView,
			layer: sketchGraphicsLayer,
			creationMode: 'update',
		});

		setSketchViewModel(
			new SketchViewModel({
				view: mapView,
				layer: graphicsLayer,
				updateOnGraphicClick: false,
				defaultUpdateOptions: {
					toggleToolOnClick: false,
				},
			}),
		);

		// widgets
		const homeWidget = new Home({
			view: mapView,
		});

		const layerList = new LayerList({
			view: mapView,
		});

		const basemapGallery = new BasemapGallery({
			view: mapView,
			container: 'gallery',
		});

		const expandBaseGallery = new Expand({
			view: mapView,
			content: basemapGallery,
		});

		const expandLayerList = new Expand({
			view: mapView,
			content: layerList,
		});

		// add elements
		mapView.when(() => {
			mapView.ui.add(homeWidget, 'top-left');
			mapView.ui.add(sketch, 'top-right');
			mapView.ui.add(expandBaseGallery, 'top-right');
			mapView.ui.add(expandLayerList, 'top-right');
		});

		sketch.on('create', function (event) {
			// check if the create event's state has changed to complete indicating
			// the graphic create operation is completed.
			if (event.state === 'complete') {
				// remove the graphic from the layer. Sketch adds
				// the completed graphic to the layer by default.
				graphicsLayer.remove(event.graphic);

				// use the graphic.geometry to query features that intersect it
				// selectFeatures(event.graphic.geometry);

				console.log('graphic', event.graphic.geometry);
			}
		});
		sketchViewModel.on('create', function (event) {
			// check if the create event's state has changed to complete indicating
			// the graphic create operation is completed.
			if (event.state === 'complete') {
				// remove the graphic from the layer. Sketch adds
				// the completed graphic to the layer by default.
				graphicsLayer.remove(event.graphic);

				// use the graphic.geometry to query features that intersect it
				// selectFeatures(event.graphic.geometry);

				console.log('graphic manual', event.graphic.geometry);
			}
		});
	}, []);

	return (
		<>
			<Row className="page-titles">
				<Col className="col-auto">
					<ol className="breadcrumb py-1">
						<li className="breadcrumb-item text-nowrap">Home</li>
						<li className="breadcrumb-item text-nowrap active">Index</li>
					</ol>
				</Col>
				<Col className="d-flex justify-content-end align-items-center">
					<div>
						<Button variant="primary" size="sm">
							Primary
						</Button>{' '}
						<Button variant="secondary" size="sm">
							Secondary
						</Button>
					</div>
				</Col>
			</Row>
			<Card>
				<Card.Header className="d-flex justify-content-between align-items-center">
					Mapa
					<div>
						<Button
							variant="primary"
							size="sm"
							onClick={() => {
								sketchViewModel?.create('polygon');
							}}
						>
							Poligon
						</Button>{' '}
						<Button
							variant="primary"
							size="sm"
							onClick={() => {
								sketchViewModel?.create('circle');
							}}
						>
							Circle
						</Button>{' '}
						<Button
							variant="secondary"
							size="sm"
							onClick={() => {
								graphicsLayer?.removeAll();
							}}
						>
							clear
						</Button>
					</div>
				</Card.Header>
				<Card.Body>
					<div className="map__body" ref={mapContainer}></div>
				</Card.Body>
			</Card>
		</>
	);
};

export default index;
