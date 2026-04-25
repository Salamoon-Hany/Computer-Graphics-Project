import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))  

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((0, 0, 0))

    pygame.draw.circle(screen, (255, 255, 255), (400, 300), 2)

    pygame.draw.line(screen, (0, 255, 0), (100, 100), (700, 500), 3)

    pygame.display.flip()

pygame.quit()