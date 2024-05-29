import { books } from '@/data/books.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@a-type/ui/components/select';

export interface BookSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function BookSelect({ value, onValueChange }: BookSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger />
      <SelectContent>
        {books.map((book) => (
          <SelectItem value={book.id} key={book.id}>
            {book.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
