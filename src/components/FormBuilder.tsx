import { useState, useEffect, type JSX } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import FormDataInterface from "@/interfaces/FormDataInterface";
import EventInterface from "@/interfaces/EventInterface";
import { applyMask } from "@/utils/formatUtils";

type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "date"
  | "radio";
type MaskType =
  | "none"
  | "cpf"
  | "cnpj"
  | "phone"
  | "cep"
  | "date"
  | "currency"
  | "custom";

interface FormField {
  _id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  mask?: string;
  maskType?: MaskType;
}

interface MaskOption {
  value: MaskType;
  label: string;
}

interface InterfaceFormBuilder {
  form: FormDataInterface | EventInterface;
  setForm: any;
}

type FormValues = Record<string, string | boolean | string[]>;

export default function FormBuilder({
  form,
  setForm,
}: InterfaceFormBuilder): JSX.Element {
  const [fields, setFields] = useState<FormField[]>(form.customFields ?? []);
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");
  const [formTitle, setFormTitle] = useState<string>("Meu Formulário");
  const [formValues, setFormValues] = useState<FormValues>({});
  console.log(form.customFields);
  
  // Resetar valores do formulário quando os campos mudam
  useEffect(() => {
    const initialValues: FormValues = {};
    fields.forEach((field: FormField) => {
      initialValues[field._id] = "";
    });
    setFormValues(initialValues);
  }, [fields.length]);

  // Atualiznado fields
  useEffect(() => {
    setForm((prev: any) => ({
      ...prev,
      customFields: fields,
    }));
  }, [fields]);

  const addField = (): void => {
    const newField: FormField = {
      _id: Date.now().toString(),
      type: newFieldType,
      label: `Campo ${fields.length + 1}`,
      placeholder: "",
      required: false,
      options:
        newFieldType === "select" ||
        newFieldType === "radio" ||
        newFieldType === "checkbox"
          ? ["Opção 1", "Opção 2"]
          : undefined,
      maskType: "none",
    };
    setFields([...fields, newField]);
    setForm((prev: any) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));
  };

  const removeField = (id: string): void => {
    setFields(fields.filter((field: FormField) => field._id !== id));
    setForm((prev: any) => ({
      ...prev,
      customFields: prev.customFields?.filter((field: any) => field._id !== id),
    }));
  };

  const updateField = (id: string, updates: Partial<FormField>): void => {
    console.log(updates);
    
    setFields(
      fields.map((field: FormField) =>
        field._id === id ? { ...field, ...updates } : field
      )
    );
  };

  const moveField = (id: string, direction: "up" | "down"): void => {
    const index: number = fields.findIndex(
      (field: FormField) => field._id === id
    );
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < fields.length - 1)
    ) {
      const newFields: FormField[] = [...fields];
      const targetIndex: number = direction === "up" ? index - 1 : index + 1;
      [newFields[index], newFields[targetIndex]] = [
        newFields[targetIndex],
        newFields[index],
      ];
      setFields(newFields);
    }
  };

  const addOption = (fieldId: string): void => {
    const field: FormField | undefined = fields.find(
      (f: FormField) => f._id === fieldId
    );
    if (field && field.options) {
      const newOptionIndex = field.options.length + 1;
      updateField(fieldId, {
        options: [...field.options, `Opção ${newOptionIndex}`],
      });
    }
  };

  const updateOption = (
    fieldId: string,
    optionIndex: number,
    value: string
  ): void => {
    const field: FormField | undefined = fields.find(
      (f: FormField) => f._id === fieldId
    );

    if (field && field.options) {
      const newOptions: string[] = [...field.options];
      // Permitir valores vazios durante a edição
      newOptions[optionIndex] = value;
      updateField(fieldId, { options: newOptions });
    }
  };

  const removeOption = (fieldId: string, optionIndex: number): void => {
    const field: FormField | undefined = fields.find(
      (f: FormField) => f._id === fieldId
    );
    if (field && field.options && field.options.length > 1) {
      const newOptions: string[] = field.options.filter(
        (_: string, index: number) => index !== optionIndex
      );
      updateField(fieldId, { options: newOptions });
    }
  };

  const handleInputChange = (
    fieldId: string,
    value: string | boolean | string[]
  ): void => {
    const field: FormField | undefined = fields.find(
      (f: FormField) => f._id === fieldId
    );

    if (field) {
      let formattedValue: string | boolean | string[] = value;

      // Aplicar máscara apenas se o valor for string e se o campo tiver máscara
      if (
        typeof value === "string" &&
        field.maskType &&
        field.maskType !== "none"
      ) {
        formattedValue = applyMask(value, field.maskType, field.mask);
      }

      setFormValues({
        ...formValues,
        [fieldId]: formattedValue,
      });
    }
  };

  // Função para obter o valor seguro para exibição (com fallback apenas para renderização)
  const getSafeOptionValue = (option: string, index: number): string => {
    return option.trim() || `Opção ${index + 1}`;
  };

  // Função para obter o valor seguro para o SelectItem (nunca vazio)
  const getSafeSelectValue = (option: string, index: number): string => {
    const safeOption = getSafeOptionValue(option, index);
    return safeOption.toLowerCase().replace(/\s+/g, "-");
  };

  const renderField = (field: FormField): JSX.Element | null => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={
              field.type === "number" && field.maskType !== "none"
                ? "text"
                : field.type
            }
            placeholder={
              field.placeholder || `Digite ${field.label.toLowerCase()}`
            }
            value={(formValues[field._id] as string) || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={
              field.placeholder || `Digite ${field.label.toLowerCase()}`
            }
            value={(formValues[field._id] as string) || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
          />
        );
      case "select":
        return (
          <Select
            value={(formValues[field._id] as string) || ""}
            onValueChange={(value: string) =>
              handleInputChange(field._id, value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {field.options
                ?.filter((option: string) => option.trim() !== "") // Filtrar opções vazias
                .map((option: string, index: number) => (
                  <SelectItem
                    key={index}
                    value={getSafeSelectValue(option, index)}
                  >
                    {getSafeOptionValue(option, index)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="space-y-2 p-2">
            <Label>{field.label}</Label>
            {field.options?.map((option, index) => {
              const currentValues = Array.isArray(formValues[field._id])
                ? (formValues[field._id] as string[])
                : [];

              const optionValue =
                option.trim() !== "" ? option : `Opção ${index + 1}`;

              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentValues.includes(optionValue)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        handleInputChange(field._id, [
                          ...currentValues,
                          optionValue,
                        ]);
                      } else {
                        handleInputChange(
                          field._id,
                          currentValues.filter((item) => item !== optionValue)
                        );
                      }
                    }}
                  />
                  <span className="text-sm">{optionValue}</span>
                </div>
              );
            })}
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options
              ?.filter((option: string) => option.trim() !== "") // Filtrar opções vazias
              .map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field._id}
                    value={getSafeSelectValue(option, index)}
                    checked={
                      (formValues[field._id] as string) ===
                      getSafeSelectValue(option, index)
                    }
                    onChange={(e) =>
                      handleInputChange(field._id, e.target.value)
                    }
                  />
                  <span className="text-sm">
                    {getSafeOptionValue(option, index)}
                  </span>
                </div>
              ))}
          </div>
        );
      default:
        return null;
    }
  };

  const getMaskOptions = (): MaskOption[] => {
    return [
      { value: "none", label: "Sem máscara" },
      { value: "cpf", label: "CPF (000.000.000-00)" },
      { value: "cnpj", label: "CNPJ (00.000.000/0000-00)" },
      { value: "phone", label: "Telefone ((00) 00000-0000)" },
      { value: "cep", label: "CEP (00000-000)" },
      { value: "date", label: "Data (00/00/0000)" },
      { value: "currency", label: "Moeda (R$ 0,00)" },
      { value: "custom", label: "Personalizada" },
    ];
  };

  return (
    <div className="container mx-auto p-2 sm:p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Criador de Formulários
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Formulário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-title">Título do Formulário</Label>
                <Input
                  id="form-title"
                  value={formTitle}
                  onChange={(e) => {
                    setForm((prev: any) => ({
                      ...prev,
                      formTitle: e.target.value,
                    }));
                    setFormTitle(e.target.value);
                  }}
                  placeholder="Digite o título do formulário"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Campo</CardTitle>
              <CardDescription>
                Escolha o tipo de campo que deseja adicionar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={newFieldType}
                  onValueChange={(value: FieldType) => setNewFieldType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="textarea">Área de Texto</SelectItem>
                    <SelectItem value="select">Lista Suspensa</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Botões de Opção</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addField} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Campos */}
          <Card>
            <CardHeader>
              <CardTitle>Campos do Formulário ({fields.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum campo adicionado ainda. Use o botão acima para
                  adicionar campos.
                </p>
              ) : (
                fields.map((field: FormField, index: number) => (
                  <Card key={field._id} className="p-3 sm:p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-medium capitalize">
                          {field.type}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveField(field._id, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveField(field._id, "down")}
                            disabled={index === fields.length - 1}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeField(field._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor={`label-${field._id}`}>Rótulo</Label>
                          <Input
                            id={`label-${field._id}`}
                            value={field.label}
                            onChange={(e) =>
                              updateField(field._id, { label: e.target.value })
                            }
                            placeholder="Digite o rótulo do campo"
                          />
                        </div>

                        {field.type === "checkbox" && field.options && (
                          <div>
                            <Label>{field.label}</Label>
                            {field.options.map((option) => {
                              const currentValues = Array.isArray(
                                formValues[field._id]
                              )
                                ? (formValues[field._id] as string[])
                                : [];

                              return (
                                <div
                                  key={option}
                                  className="flex items-center space-x-2 p-2"
                                >
                                  <Checkbox
                                    checked={currentValues.includes(option)}
                                    onCheckedChange={(checked: boolean) => {
                                      if (checked) {
                                        handleInputChange(field._id, [
                                          ...currentValues,
                                          option,
                                        ]);
                                      } else {
                                        handleInputChange(
                                          field._id,
                                          currentValues.filter(
                                            (item) => item !== option
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{option}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Opção de máscara para campos de texto e número */}
                        {(field.type === "text" || field.type === "number") && (
                          <div className="space-y-2">
                            <Label htmlFor={`mask-${field._id}`}>Máscara</Label>
                            <Select
                              value={field.maskType || "none"}
                              onValueChange={(value: MaskType) =>
                                updateField(field._id, { maskType: value })
                              }
                            >
                              <SelectTrigger id={`mask-${field._id}`}>
                                <SelectValue placeholder="Selecione uma máscara" />
                              </SelectTrigger>
                              <SelectContent>
                                {getMaskOptions().map((option: MaskOption) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {field.maskType === "custom" && (
                              <div className="mt-2">
                                <Label htmlFor={`custom-mask-${field._id}`}>
                                  Máscara personalizada
                                </Label>
                                <Input
                                  id={`custom-mask-${field._id}`}
                                  value={field.mask || ""}
                                  onChange={(e) =>
                                    updateField(field._id, {
                                      mask: e.target.value,
                                    })
                                  }
                                  placeholder="Ex: ##.###-### (# = caractere)"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Use # para representar um caractere a ser
                                  digitado
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.required}
                            defaultChecked={true}
                            onCheckedChange={(checked: boolean) =>
                              updateField(field._id, { required: checked })
                            }
                          />
                          <Label>Campo obrigatório</Label>
                        </div>

                        {(field.type === "select" ||
                          field.type === "radio" ||
                          field.type === "checkbox") && (
                          <div className="space-y-2">
                            <Label>Opções</Label>
                            {field.options?.map(
                              (option: string, optionIndex: number) => (
                                <div key={optionIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) =>
                                      updateOption(
                                        field._id,
                                        optionIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Opção ${optionIndex + 1}`}
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      removeOption(field._id, optionIndex)
                                    }
                                    disabled={field.options!.length <= 1}
                                    className="shrink-0"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addOption(field._id)}
                              className="w-full sm:w-auto"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Adicionar Opção
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview em tempo real */}
        <div className="space-y-4 lg:sticky lg:top-4 self-start">
          <Card className="overflow-hidden">
            <CardHeader className="bg-white sticky top-0 z-10">
              <CardTitle>Preview em Tempo Real</CardTitle>
              <CardDescription>Veja como seu formulário ficará</CardDescription>
            </CardHeader>
            <CardContent className="p-0 max-h-[calc(100vh-200px)] overflow-y-auto">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>{formTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {fields.map((field: FormField) => (
                    <div key={field._id} className="space-y-2">
                      {field.type !== "checkbox" && (
                        <Label>
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                      )}
                      {renderField(field)}
                    </div>
                  ))}
                  {fields.length > 0 && (
                    <Button className="w-full mt-4">Enviar</Button>
                  )}
                  {fields.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Adicione campos para ver o preview
                    </p>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
