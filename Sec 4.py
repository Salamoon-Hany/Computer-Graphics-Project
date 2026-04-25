import matplotlib.pyplot as plt

def lineDDA(x0, y0, xEnd, yEnd):
    # 1. Calculate the differences
    dx = xEnd - x0
    dy = yEnd - y0

    # 2. Determine the number of steps
    steps = max(abs(dx), abs(dy))

    # 3. Calculate the increment at each step
    x_inc = dx / float(steps)
    y_inc = dy / float(steps)

    # 4. Start from the first point
    x = x0
    y = y0

    x_points = []
    y_points = []

    print(f"{'k':<5} {'x':<10} {'y':<10} {'(Round x, Round y)':<15}")
    print("-" * 45)

    for k in range(int(steps) + 1):
        # Store points for plotting (after rounding)
        x_points.append(round(x))
        y_points.append(round(y))

        print(f"{k:<5} {x:<10.2f} {y:<10.2f} ({round(x)}, {round(y)})")

        # Increment the values for the next step
        x += x_inc
        y += y_inc

    plt.scatter(x_points, y_points, color='red')
    plt.plot(x_points, y_points, color='blue', alpha=0.3)
    plt.title("DDA Line Algorithm")
    plt.grid(True)
    plt.show()

# Example call — change these values as needed
lineDDA(0, 0, 6, 4)