import matplotlib.pyplot as plt
def bresenham_line(x0, y0, x1, y1):
    pixels = []
    # Calculate absolute differences
    dx = abs(x1 - x0)
    dy = abs(y1 - y0)
    # Determine the direction of movement (step)
    sx = 1 if x0 < x1 else -1
    sy = 1 if y0 < y1 else -1
    # Initial error coefficient
    err = dx - dy
    while True:
        pixels.append((x0, y0))
        # Stop at the endpoint
        if x0 == x1 and y0 == y1:
            break
        e2 = 2 * err
        # Decide to move in the X direction
        if e2 > -dy:
            err -= dy
            x0 += sx
        # Decide to move in the Y direction
        if e2 < dx:
            err += dx
            y0 += sy
    return pixels
# Code testing and drawing
start_point = (20, 10)
end_point = (30, 18)
line_pixels = bresenham_line(start_point[0], start_point[1],
                             end_point[0], end_point[1])
# Extracting X and Y coordinates for drawing
x_coords = [p[0] for p in line_pixels]
y_coords = [p[1] for p in line_pixels]
plt.scatter(x_coords, y_coords, color='black', s=100, marker='s')
# Drawing pixels as grids
plt.grid(True)
plt.title("Bresenham's Line Algorithm")
plt.show()
