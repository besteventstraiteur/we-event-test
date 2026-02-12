
import { fabric } from 'fabric';

// Function to create room plan
export const createRoomPlan = (
  fabricCanvas: fabric.Canvas, 
  width: number, 
  height: number, 
  readOnly: boolean = false
) => {
  fabricCanvas.clear();
  const room = new fabric.Rect({
    left: 50,
    top: 50,
    width: width,
    height: height,
    fill: 'white',
    stroke: '#ccc',
    strokeWidth: 2,
    selectable: !readOnly,
  });
  fabricCanvas.add(room);
  fabricCanvas.centerObject(room);
  fabricCanvas.renderAll();
};

// Function to create and add objects to canvas
export const addObjectToCanvas = (
  canvas: fabric.Canvas, 
  type: string
) => {
  if (!canvas) return;

  let object;

  switch (type) {
    case 'tableRonde180':
      object = new fabric.Circle({
        radius: 90,
        fill: '#d1bc8a',
        stroke: '#bca976',
        strokeWidth: 2,
        left: 100,
        top: 100,
        originX: 'center',
        originY: 'center',
      });
      object.set('type', 'tableRonde180');
      object.set('capacity', 10);
      break;
    case 'tableRonde152':
      object = new fabric.Circle({
        radius: 76,
        fill: '#d1bc8a',
        stroke: '#bca976',
        strokeWidth: 2,
        left: 100,
        top: 100,
        originX: 'center',
        originY: 'center',
      });
      object.set('type', 'tableRonde152');
      object.set('capacity', 8);
      break;
    case 'tableRectangle':
      object = new fabric.Rect({
        width: 180,
        height: 80,
        fill: '#d1bc8a',
        stroke: '#bca976',
        strokeWidth: 2,
        left: 100,
        top: 100,
        originX: 'center',
        originY: 'center',
      });
      object.set('type', 'tableRectangle');
      object.set('capacity', 6);
      break;
    case 'chaise':
      object = new fabric.Circle({
        radius: 15,
        fill: '#8a8a8a',
        stroke: '#666666',
        strokeWidth: 1,
        left: 100,
        top: 100,
        originX: 'center',
        originY: 'center',
      });
      object.set('type', 'chaise');
      break;
    default:
      return;
  }

  if (object) {
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.renderAll();
  }
  
  return object;
};
