import { BaseModel, IBaseModel } from './BaseModel';
import { supabase } from '../supabaseClient';

interface IUnit extends IBaseModel {
  chapter_id: number;
  title: string;
  description: string;
  order: number;
}

export class Unit extends BaseModel implements IUnit {
  chapter_id: number;
  title: string;
  description: string;
  order: number;

  constructor(data: IUnit) {
    super(data);
    this.chapter_id = data.chapter_id;
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
  }

  static fromJson(json: Record<string, any>): Unit {
    return new Unit({
      ...BaseModel.fromJson(json),
      chapter_id: json.chapter_id,
      title: json.title,
      description: json.description,
      order: json.order,
    });
  }

  toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      chapter_id: this.chapter_id,
      title: this.title,
      description: this.description,
      order: this.order,
    };
  }

  async create(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('Units')
        .insert([this.toJson()])
        .select()
        .single();

      if (error) {
        throw error;
      }

      this.id = data.id;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
