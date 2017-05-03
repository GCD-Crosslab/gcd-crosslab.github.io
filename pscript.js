var hitOptions = {
	segments: true,
	stroke: true,
	fill: true,
	tolerance: 5
};

// Imported SVG Groups have their applyMatrix flag turned off by
// default. This is required for SVG importing to work correctly. Turn
// it on now, so we don't have to deal with nested coordinate spaces.
var crosslab = project.importSVG(document.getElementById('svg'));
crosslab.visible = true; // Turn off the effect of display:none;
crosslab.fillColor = 'black';
crosslab.strokeColor = 'black';
crosslab.strokeWidth = 2;

// Resize the crosslab to fit snugly inside the view:
crosslab.fitBounds(view.bounds);
crosslab.scale(0.8);

var segment, path;
var movePath = false;
function onMouseDown(event) {
	segment = path = null;
	var hitResult = project.hitTest(event.point, hitOptions);
	if (!hitResult)
		return;

	if (event.modifiers.shift) {
		if (hitResult.type == 'segment') {
			hitResult.segment.remove();
		};
		return;
	}

	if (hitResult) {
		path = hitResult.item;
		if (hitResult.type == 'segment') {
			segment = hitResult.segment;
		} else if (hitResult.type == 'stroke') {
			var location = hitResult.location;
			segment = path.insert(location.index + 1, event.point);
			//path.smooth();
		}
	}
	movePath = hitResult.type == 'fill';
	if (movePath)
		project.activeLayer.addChild(hitResult.item);
}

function onMouseMove(event) {
	project.activeLayer.selected = false;
	if (event.item)
		event.item.selected = true;
}

function onMouseDrag(event) {
	if (segment) {
		segment.point += event.delta;
		//path.smooth();
	} else if (path) {
		path.position += event.delta;
	}
}
