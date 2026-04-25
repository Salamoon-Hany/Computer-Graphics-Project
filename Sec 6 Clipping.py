import matplotlib.pyplot as plt
import matplotlib.patches as patches
def clip_polygon(polygon, boundary, axis, is_max):
    """Clip a polygon against a single boundary edge.
    polygon  : list of (x, y) vertices
    boundary : the clipping coordinate value (x_min, x_max, y_min, or y_max)
    axis     : 0 for X-axis boundary, 1 for Y-axis boundary
    is_max   : True  -> clip against a maximum boundary (right or top)
               False -> clip against a minimum boundary (left or bottom)
    """
    clipped = []
    def inside(p):
        if is_max:
            return p[axis] <= boundary
        else:
            return p[axis] >= boundary
    def intersect(p1, p2):
        # Compute intersection of segment p1-p2 with the boundary
        if axis == 0:
            # Vertical boundary (x = boundary)
            t = (boundary - p1[0]) / (p2[0] - p1[0])
            y = p1[1] + t * (p2[1] - p1[1])
            return (boundary, y)
        else:
            # Horizontal boundary (y = boundary)
            t = (boundary - p1[1]) / (p2[1] - p1[1])
            x = p1[0] + t * (p2[0] - p1[0])
            return (x, boundary)
    for i in range(len(polygon)):
        current = polygon[i]
        previous = polygon[i - 1]  # wraps around to last vertex for i == 0
        if inside(current):
            if not inside(previous):
                # Previous was outside, current is inside -> add intersection first
                clipped.append(intersect(previous, current))
            clipped.append(current)
        elif inside(previous):
            # Previous was inside, current is outside -> add intersection only
            clipped.append(intersect(previous, current))
    return clipped
def sutherland_hodgman(polygon, clipping_window):
    """Clip a polygon using the Sutherland-Hodgman algorithm.
    polygon         : list of (x, y) vertices (ordered)
    clipping_window : [x_min, x_max, y_min, y_max]
    """
    # Step 1: Clip against Left Boundary (x >= x_min)
    polygon = clip_polygon(polygon, clipping_window[0], 0, False)
    # Step 2: Clip against Right Boundary (x <= x_max)
    polygon = clip_polygon(polygon, clipping_window[1], 0, True)
    # Step 3: Clip against Bottom Boundary (y >= y_min)
    polygon = clip_polygon(polygon, clipping_window[2], 1, False)
    # Step 4: Clip against Top Boundary (y <= y_max)
    polygon = clip_polygon(polygon, clipping_window[3], 1, True)
    return polygon
# Example Usage
subject_polygon = [(50, 150), (200, 50), (350, 150)]  # A Triangle
clipping_window = [100, 300, 100, 300]  # [x_min, x_max, y_min, y_max]
final_vertices = sutherland_hodgman(subject_polygon, clipping_window)
print("Clipped Vertices:", final_vertices)
# Visualization
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
def draw_polygon(ax, vertices, color, label):
    if vertices:
        xs = [v[0] for v in vertices] + [vertices[0][0]]
        ys = [v[1] for v in vertices] + [vertices[0][1]]
        ax.plot(xs, ys, color=color, linewidth=2, label=label)
        ax.fill(xs, ys, alpha=0.2, color=color)
x_min, x_max, y_min, y_max = clipping_window
for ax in axes:
    rect = patches.Rectangle(
        (x_min, y_min), x_max - x_min, y_max - y_min,
        linewidth=2, edgecolor='blue', facecolor='lightblue', alpha=0.3,
        label='Clipping Window'
    )
    ax.add_patch(rect)
    ax.set_xlim(0, 400)
    ax.set_ylim(0, 400)
    ax.set_aspect('equal')
    ax.grid(True)
draw_polygon(axes[0], subject_polygon, 'red', 'Original Polygon')
axes[0].set_title('Before Clipping')
axes[0].legend()
draw_polygon(axes[1], final_vertices, 'green', 'Clipped Polygon')
axes[1].set_title('After Clipping (Sutherland-Hodgman)')
axes[1].legend()
plt.tight_layout()
plt.show()

#Ex
subject_polygon = [(50, 150), (200, 50), (350, 150)]  # Triangle
clipping_window = [100, 300, 100, 300]
final_vertices = sutherland_hodgman(subject_polygon, clipping_window)