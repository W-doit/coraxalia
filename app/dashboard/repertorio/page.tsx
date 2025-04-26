import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, FolderOpen, ExternalLink } from "lucide-react"

// Mock data for repertoire
const repertoire = [
  {
    category: "Navidad",
    pieces: [
      { title: "Noche de Paz", composer: "Franz Xaver Gruber", year: 1818 },
      { title: "Adeste Fideles", composer: "John Francis Wade", year: 1751 },
      { title: "Jingle Bells", composer: "James Lord Pierpont", year: 1857 },
      { title: "El Tamborilero", composer: "Katherine Kennicott Davis", year: 1941 },
    ],
  },
  {
    category: "Clásico",
    pieces: [
      { title: "Ave Maria", composer: "Franz Schubert", year: 1825 },
      { title: "Aleluya (El Mesías)", composer: "Georg Friedrich Händel", year: 1741 },
      { title: "Gloria in Excelsis Deo", composer: "Antonio Vivaldi", year: 1715 },
      { title: "Lacrimosa (Réquiem)", composer: "Wolfgang Amadeus Mozart", year: 1791 },
    ],
  },
  {
    category: "Popular",
    pieces: [
      { title: "Bohemian Rhapsody", composer: "Freddie Mercury", year: 1975 },
      { title: "Hallelujah", composer: "Leonard Cohen", year: 1984 },
      { title: "The Sound of Silence", composer: "Paul Simon", year: 1964 },
      { title: "Africa", composer: "David Paich & Jeff Porcaro", year: 1982 },
    ],
  },
]

export default function Repertorio() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Repertorio</h2>
        <Button>
          <ExternalLink className="mr-2 h-4 w-4" />
          Abrir Google Drive
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todo</TabsTrigger>
          <TabsTrigger value="navidad">Navidad</TabsTrigger>
          <TabsTrigger value="clasico">Clásico</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {repertoire.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>Partituras y archivos de audio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {category.pieces.map((piece, pieceIndex) => (
                    <div key={pieceIndex} className="flex items-start p-4 rounded-lg border">
                      <div className="mr-4 mt-1">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{piece.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {piece.composer}, {piece.year}
                        </p>
                        <div className="flex mt-2 space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-3 w-3" />
                            Partitura
                          </Button>
                          <Button variant="outline" size="sm">
                            <FolderOpen className="mr-2 h-3 w-3" />
                            Archivos
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {repertoire.map((category, index) => (
          <TabsContent key={index} value={category.category.toLowerCase()} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>Partituras y archivos de audio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {category.pieces.map((piece, pieceIndex) => (
                    <div key={pieceIndex} className="flex items-start p-4 rounded-lg border">
                      <div className="mr-4 mt-1">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{piece.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {piece.composer}, {piece.year}
                        </p>
                        <div className="flex mt-2 space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-3 w-3" />
                            Partitura
                          </Button>
                          <Button variant="outline" size="sm">
                            <FolderOpen className="mr-2 h-3 w-3" />
                            Archivos
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
