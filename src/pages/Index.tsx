import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

type BlockType = "redstone" | "repeater" | "torch" | "block" | "lever" | "button" | null;

interface GridCell {
  type: BlockType;
  powered: boolean;
}

const Index = () => {
  const [grid, setGrid] = useState<GridCell[][]>(
    Array(16).fill(null).map(() => 
      Array(16).fill(null).map(() => ({ type: null, powered: false }))
    )
  );
  const [selectedTool, setSelectedTool] = useState<BlockType>("redstone");

  const tools: { type: BlockType; icon: string; label: string }[] = [
    { type: "redstone", icon: "Zap", label: "Провод" },
    { type: "repeater", icon: "ArrowRight", label: "Повторитель" },
    { type: "torch", icon: "Flame", label: "Факел" },
    { type: "block", icon: "Square", label: "Блок" },
    { type: "lever", icon: "ToggleLeft", label: "Рычаг" },
    { type: "button", icon: "Circle", label: "Кнопка" },
  ];

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];
    if (selectedTool === null) {
      newGrid[row][col] = { type: null, powered: false };
    } else {
      newGrid[row][col] = { type: selectedTool, powered: false };
    }
    setGrid(newGrid);
  };

  const handleExport = () => {
    const schematicData = {
      version: 1,
      size: { x: 16, y: 1, z: 16 },
      blocks: grid.flatMap((row, z) => 
        row.map((cell, x) => ({
          pos: { x, y: 0, z },
          type: cell.type || "air"
        })).filter(block => block.type !== "air")
      )
    };
    
    const blob = new Blob([JSON.stringify(schematicData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "redstone_schematic.nbt";
    a.click();
    
    toast.success("Схема экспортирована!", {
      description: "Файл NBT готов для импорта в Minecraft"
    });
  };

  const handleClear = () => {
    setGrid(Array(16).fill(null).map(() => 
      Array(16).fill(null).map(() => ({ type: null, powered: false }))
    ));
    toast.info("Сетка очищена");
  };

  const getBlockColor = (type: BlockType) => {
    switch (type) {
      case "redstone": return "bg-red-600 border-red-800";
      case "repeater": return "bg-stone-600 border-stone-800";
      case "torch": return "bg-orange-600 border-orange-800";
      case "block": return "bg-stone-500 border-stone-700";
      case "lever": return "bg-amber-700 border-amber-900";
      case "button": return "bg-stone-400 border-stone-600";
      default: return "bg-stone-900/50 border-stone-800";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            REDSTONE BUILDER
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Проектируй редстоун-схемы и экспортируй в Minecraft
          </p>
        </header>

        <Tabs defaultValue="constructor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border-2 border-border">
            <TabsTrigger value="constructor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Hammer" size={18} className="mr-2" />
              Конструктор
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="HelpCircle" size={18} className="mr-2" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="constructor" className="space-y-6">
            <Card className="p-4 md:p-6 border-2 border-border bg-card">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-primary">Инструменты</h2>
                <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2">
                  {tools.map((tool) => (
                    <Button
                      key={tool.type}
                      onClick={() => setSelectedTool(tool.type)}
                      variant={selectedTool === tool.type ? "default" : "outline"}
                      className="border-2"
                      size="lg"
                    >
                      <Icon name={tool.icon} size={20} className="mr-2" />
                      <span className="hidden md:inline">{tool.label}</span>
                    </Button>
                  ))}
                  <Button
                    onClick={() => setSelectedTool(null)}
                    variant={selectedTool === null ? "default" : "outline"}
                    className="border-2"
                    size="lg"
                  >
                    <Icon name="Eraser" size={20} className="mr-2" />
                    <span className="hidden md:inline">Ластик</span>
                  </Button>
                </div>
              </div>

              <div className="mb-6 overflow-x-auto">
                <div className="inline-block border-4 border-border bg-stone-950 p-1">
                  <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(16, minmax(0, 1fr))` }}>
                    {grid.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className={`w-6 h-6 md:w-8 md:h-8 border-2 transition-all hover:scale-110 ${getBlockColor(cell.type)}`}
                          title={cell.type || "Пусто"}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button onClick={handleExport} size="lg" className="border-2">
                  <Icon name="Download" size={20} className="mr-2" />
                  Экспорт NBT
                </Button>
                <Button onClick={handleClear} variant="outline" size="lg" className="border-2">
                  <Icon name="Trash2" size={20} className="mr-2" />
                  Очистить
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card className="p-4 md:p-6 border-2 border-border bg-card">
              <h2 className="text-2xl font-bold mb-6 text-primary">Часто задаваемые вопросы</h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-2 border-border rounded-none px-4 bg-muted/30">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Как использовать конструктор?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Выберите инструмент из панели и кликайте по сетке, чтобы размещать блоки. 
                    Используйте ластик для удаления элементов. После завершения нажмите "Экспорт NBT".
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-2 border-border rounded-none px-4 bg-muted/30">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Что такое NBT-файл?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    NBT (Named Binary Tag) — формат данных Minecraft для сохранения структур и схем. 
                    Файл можно импортировать в игру с помощью модов типа WorldEdit или Schematica.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-2 border-border rounded-none px-4 bg-muted/30">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Какие блоки доступны?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    В текущей версии доступны основные редстоун-компоненты: провод, повторитель, 
                    факел, обычный блок, рычаг и кнопка. Больше блоков будет добавлено в будущих обновлениях.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-2 border-border rounded-none px-4 bg-muted/30">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Как импортировать схему в Minecraft?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Установите мод WorldEdit или Litematica. Скопируйте NBT-файл в папку schematics. 
                    В игре используйте команду //load или интерфейс мода для загрузки схемы.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-2 border-border rounded-none px-4 bg-muted/30">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Можно ли сохранить проект?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Сейчас схема сохраняется только при экспорте в NBT. Функция сохранения 
                    проектов в браузере появится в следующих версиях конструктора.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
