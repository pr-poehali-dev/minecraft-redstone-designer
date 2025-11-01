import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

type BlockType = "redstone" | "repeater" | "torch" | "block" | "lever" | "button" | "piston" | "sticky_piston" | "observer" | "comparator" | "redstone_lamp" | "hopper" | "dispenser" | "dropper" | null;

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

  const tools: { type: BlockType; icon: string; label: string; color: string }[] = [
    { type: "redstone", icon: "Zap", label: "Провод", color: "#8B0000" },
    { type: "repeater", icon: "ArrowRight", label: "Повторитель", color: "#696969" },
    { type: "comparator", icon: "GitCompare", label: "Компаратор", color: "#A9A9A9" },
    { type: "torch", icon: "Flame", label: "Факел", color: "#FF6347" },
    { type: "redstone_lamp", icon: "Lightbulb", label: "Лампа", color: "#FFD700" },
    { type: "piston", icon: "Box", label: "Поршень", color: "#8B7355" },
    { type: "sticky_piston", icon: "Package", label: "Липкий поршень", color: "#6B8E23" },
    { type: "observer", icon: "Eye", label: "Наблюдатель", color: "#4A4A4A" },
    { type: "lever", icon: "ToggleLeft", label: "Рычаг", color: "#8B4513" },
    { type: "button", icon: "Circle", label: "Кнопка", color: "#A0522D" },
    { type: "hopper", icon: "Container", label: "Воронка", color: "#2F4F4F" },
    { type: "dispenser", icon: "Archive", label: "Раздатчик", color: "#708090" },
    { type: "dropper", icon: "Download", label: "Выбрасыватель", color: "#778899" },
    { type: "block", icon: "Square", label: "Блок", color: "#808080" },
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

  const getBlockStyle = (type: BlockType): React.CSSProperties => {
    const baseStyle = {
      position: 'relative' as const,
      boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.2)',
    };

    switch (type) {
      case "redstone": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)', border: '2px solid #450000' };
      case "repeater": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #808080 0%, #505050 100%)', border: '2px solid #303030' };
      case "comparator": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #A9A9A9 0%, #696969 100%)', border: '2px solid #404040' };
      case "torch": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #FF6347 0%, #CD5C5C 100%)', border: '2px solid #8B3A3A' };
      case "redstone_lamp": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)', border: '2px solid #B8860B' };
      case "piston": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #A0826D 0%, #6B5D52 100%)', border: '2px solid #4A3F37' };
      case "sticky_piston": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #7CB342 0%, #558B2F 100%)', border: '2px solid #33691E' };
      case "observer": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #616161 0%, #424242 100%)', border: '2px solid #212121' };
      case "lever": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)', border: '2px solid #654321' };
      case "button": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #A9A9A9 0%, #808080 100%)', border: '2px solid #505050' };
      case "hopper": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #3E4E50 0%, #2C3E40 100%)', border: '2px solid #1C2E30' };
      case "dispenser": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #708090 0%, #556370 100%)', border: '2px solid #3A4350' };
      case "dropper": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #778899 0%, #5D6D79 100%)', border: '2px solid #3D4D59' };
      case "block": 
        return { ...baseStyle, background: 'linear-gradient(135deg, #A9A9A9 0%, #808080 100%)', border: '2px solid #505050' };
      default: 
        return { ...baseStyle, background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', border: '2px solid #A5D6A7' };
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2">
                  {tools.map((tool) => (
                    <Button
                      key={tool.type}
                      onClick={() => setSelectedTool(tool.type)}
                      variant={selectedTool === tool.type ? "default" : "outline"}
                      className="border-2 text-xs sm:text-sm"
                      size="sm"
                      style={selectedTool === tool.type ? { backgroundColor: tool.color, borderColor: tool.color } : {}}
                    >
                      <Icon name={tool.icon} size={16} className="mr-1" />
                      <span className="truncate">{tool.label}</span>
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

              <div className="mb-6 overflow-x-auto flex justify-center">
                <div className="inline-block border-4 border-stone-600 p-1" style={{ background: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)' }}>
                  <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(16, minmax(0, 1fr))` }}>
                    {grid.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className="w-6 h-6 md:w-10 md:h-10 transition-all hover:scale-105 active:scale-95"
                          style={getBlockStyle(cell.type)}
                          title={cell.type || "Трава"}
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