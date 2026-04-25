import math

points = [
    [-1, -1,  1], [1, -1,  1], [1,  1,  1], [-1,  1,  1],
    [-1, -1, -1], [1, -1, -1], [1,  1, -1], [-1,  1, -1]
]

def scale(point, sx, sy, sz):
    return [point[0] * sx, point[1] * sy, point[2] * sz]

def translate(point, tx, ty, tz):
    return [point[0] + tx, point[1] + ty, point[2] + tz]

def rotate_y(point, angle):
    rad = math.radians(angle)
    x = point[0] * math.cos(rad) + point[2] * math.sin(rad)
    z = -point[0] * math.sin(rad) + point[2] * math.cos(rad)
    return [x, point[1], z]

p = [1, 1, 1]
p = scale(p, 2, 2, 2)
p = rotate_y(p, 45)
p = translate(p, 5, 0, 0)
print(f" :{p}")