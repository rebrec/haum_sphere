from random import randint
import json
from urllib.request import urlopen, Request



class Playground(object):
    def __init__(self):
        self.lights=[]
        self.spheres=[]
    def addLight(self, x, y, color):
        self.lights+= [Light(color=color, x=x, y=y)]
    def removeLight(self, identifier="", x="", y=""):
        if identifier != "":
            self.lights = [l for l in self.lights if l.getIdentifier() != identifier]
        elif x != "" and y != "":
            self.lights = [l for l in self.lights if not (l.x == x and l.y ==y)]
        else:
            raise(IndexError('No Light available for removing (x=%s, y=%s, identifier=%s)' % (x, y, identifier)))
    def addSphere(self, x, y, ip, port,color):
        self.spheres+= [Sphere(x=x, y=y, host_ip=ip, host_port=port, color=color)]
    def removeSphere(self, identifier="", x="", y=""):
        if identifier != "":
            self.spheres = [s for s in self.spheres if s.getIdentifier() != identifier]
        elif x != "" and y != "":
            self.spheres = [s for s in self.spheres if not (s.x == x and s.y ==y)]
        else:
            raise(IndexError('No Spheres available for removing (x=%s, y=%s, identifier=%s)' % (x, y, identifier)))



class Sphere(object):
    def __init__(self,color, host_ip, name="", host_port=80, x=0, y=0):
        if not issubclass(type(color), Color):
            raise(TypeError("color %s is not of type Color !" % color));
        self.color = color
        self.name = name
        self.x = x
        self.y = y
        self.host_ip = host_ip
        self.host_port = host_port
        self._buildUrl()

    def _buildUrl(self):
        self._host_url="HTTP://%s:%s/api/" % (self.host_ip, self.host_port)
    def setColor(self, color):
        self.color = color
        self.updateColor()


    def updateColor(self):
        data = {'led':255, 'rgb': self.color.getRGB()}
        req = Request(self._host_url)
        req.add_header('Content-Type', 'application/json')
        response = urlopen(req, json.dumps(data).encode('utf-8'))
        print(response.read())

    def getIdentifier(self):
        return id(self)

    def getConfiguration(self):
        return {
                    "Color": self.color.getRGB(),
                    "Name": self.name,
                    "x": self.x,
                    "y": self.y,
                    "IP": self.host_ip,
                    "Port": self.host_port,
                    "URL": self._host_url,
                    "identifier": self.getIdentifier(),
                }
    def __repr__(self):
        return "%s : %s" % (self.__class__.__name__, json.dumps(self.getConfiguration()))


class Light(object):
    def __init__(self,color,  x=0, y=0):
        if not issubclass(type(color), Color):
            raise(TypeError("color %s is not of type Color !" % color));
        self.color = color
        self.x = x
        self.y = y

    def identifier(self):
        return id(self)

    def getConfiguration(self):
        return {
                    "Color": self.color.getRGB(),
                    "x": self.x,
                    "y": self.y,
                    "identifier": self.identifier(),
        }
    def __repr__(self):
        return "%s : %s" % (self.__class__.__name__, json.dumps(self.getConfiguration()))


class Color(object):
    def __init__(self, R=0, G=0, B=0):
        self.R = R
        self.G = G
        self.B = B

    def getRGB(self):
       # return {"R": self.R, "G": self.G, "B": self.B}
        return [self.R, self.G, self.B]

class RandomColor(Color):
    def __init__(self):
        r = randint(0,255)
        g = randint(0,255)
        b = randint(0,255)
        super().__init__(R=r, G=g, B=b)

if __name__ == '__main__':
    from pprint import pprint
    print("main")
    # c = Color(R=1, G=255, B=1)
    c = RandomColor()
    s = Sphere(name="test", host_ip="192.168.123.123", host_port=80, x=100, y=100, color = c)
    l = Light(x=100, y=100, color = c)
    pprint(s.getConfiguration(), indent=4)
    pprint(l.getConfiguration(), indent=4)
    p = Playground()
    p.addLight(x=100, y=100, color=RandomColor())
    p.addLight(x=200, y=100, color=RandomColor())
    p.addLight(x=100, y=200, color=RandomColor())
    p.addLight(x=300, y=200, color=RandomColor())
    print('before')
    pprint(p.lights)
    p.removeLight(x=100, y=100)
    print('after')
    pprint(p.lights)
    p.addSphere(x=100, y=400, ip="1.2.3.4", port=80, color=RandomColor())
    p.addSphere(x=100, y=500, ip="1.2.3.5", port=80, color=RandomColor())
    p.addSphere(x=100, y=600, ip="1.2.3.6", port=80, color=RandomColor())
    p.addSphere(x=100, y=700, ip="1.2.3.7", port=80, color=RandomColor())
    p.addSphere(x=100, y=300, ip="1.2.3.1", port=80, color=RandomColor())
    p.addSphere(x=200, y=300, ip="2.2.3.1", port=80, color=RandomColor())
    p.addSphere(x=300, y=300, ip="3.2.3.1", port=80, color=RandomColor())
    p.addSphere(x=400, y=300, ip="4.2.3.1", port=80, color=RandomColor())
    print('before')
    pprint(p.spheres)
    p.removeSphere(x=200,y=300)
    p.removeSphere(x=100,y=600)
    print('after')
    pprint(p.spheres)




