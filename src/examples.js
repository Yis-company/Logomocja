export const examples=[
['Kwadrat','2d','; Cztery boki, cztery skręty.\nkolor "#16866a"\ngrubosc 3\npowtorz 4 [\n  np 120\n  pw 90\n]'],
['Gwiazda','2d','; Sekret gwiazdy? Kąt 144 stopni.\nkolor "#c1763d"\ngrubosc 3\npowtorz 5 [\n  np 180\n  pw 144\n]'],
['Rozeta','2d','; Obróć kwadrat i zobacz, co powstanie.\nkolor "#16866a"\ngrubosc 2\npowtorz 12 [\n  powtorz 4 [\n    np 100\n    pw 90\n  ]\n  pw 30\n]'],
['Spirala','2d','; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.\ngrubosc 2\nniech zmiana 1\npowtorz 90 [\n  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]\n  niech zmiana -zmiana\n  np nrpowt * 2.5\n  pw 89\n]'],
['Schody','3d','; Żółw wspina się w przestrzeni.\nkolor "#16866a"\ngrubosc 4\npowtorz 6 [\n  np 35\n  gora 90\n  np 20\n  dol 90\n]'],
['Sześcian','3d','; Dwa kwadraty połączone krawędziami.\nkolor "#16866a"\ngrubosc 3\npowtorz 4 [np 100 pw 90]\ngora 90 np 100 dol 90\npowtorz 4 [np 100 pw 90]\npowtorz 4 [\n  np 100\n  dol 90 np 100\n  pod ws 100 opu\n  gora 90 pw 90\n]'],
['Pierścień','3d','; Okrąg przechylony o 30 stopni.\nkolor "#a478c0"\ngrubosc 3\ngora 30\npowtorz 36 [np 12 pw 10]'],
['Helisa','3d','; Spirala wznosi się ku górze.\nkolor "#c1763d"\ngrubosc 3\npowtorz 120 [\n np 10\n pw 15\n gora 90 np 1.5 dol 90\n]']
];
