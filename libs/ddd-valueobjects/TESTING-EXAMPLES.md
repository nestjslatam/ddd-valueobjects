# Testing New Value Objects

Quick examples to test all the new value objects:

```typescript
import {
  // Text VOs
  Name,
  Description,
  Url,

  // Identification VOs
  PhoneNumber,
  DocumentId,

  // Numeric VOs
  Age,
  Money,
  Percentage,

  // Date VOs
  DateRange,
  BirthDate,
} from '@nestjslatam/ddd-valueobjects';

// ===== Text VOs =====

// Name
const name = Name.create('María', 'García', 'Isabel');
console.log('Full Name:', name.getFullName());
console.log('Initials:', name.getInitials());

// Description
const description = Description.create(
  'This is a high-quality product made with the best materials available in the market.',
);
console.log('Word Count:', description.wordCount());
console.log('Preview:', description.preview(30));

// URL
const url = Url.create('https://api.example.com/users?page=1');
console.log('Protocol:', url.getProtocol());
console.log('Domain:', url.getDomain());
console.log('Is Secure:', url.isSecure());

// ===== Identification VOs =====

// PhoneNumber
const phone = PhoneNumber.create('5551234567', { countryCode: '+1' });
console.log('Formatted:', phone.getFormatted());
console.log('National:', phone.getNationalFormat());

// DocumentId
const dni = DocumentId.createDNI('12345678', 'ARG');
const passport = DocumentId.createPassport('AB123456', 'USA');
const ssn = DocumentId.createSSN('123-45-6789');
console.log('DNI Masked:', dni.getMasked());
console.log('Passport:', passport.toString());

// ===== Numeric VOs =====

// Age
const age = Age.fromBirthDate(new Date('1990-05-15'));
console.log('Age:', age.getValue());
console.log('Category:', age.getCategory());
console.log('Is Adult:', age.isAdult());

// Money
const price = Money.create(99.99, 'USD');
const tax = Money.create(8.5, 'USD');
const total = price.add(tax);
console.log('Total:', total.format());

// Split payment
const shares = total.allocate([1, 2, 1]);
console.log(
  'Shares:',
  shares.map((s) => s.format()),
);

// Percentage
const discount = Percentage.create(25);
const discountedPrice = discount.decrease(price.amount);
console.log('Discount:', discount.format());
console.log('Final Price:', Money.create(discountedPrice, 'USD').format());

// ===== Date VOs =====

// DateRange
const range = DateRange.currentMonth();
console.log('Current Month:', range.format());
console.log('Duration:', range.getDurationDays(), 'days');

const last30Days = DateRange.lastDays(30);
console.log('Contains Today:', last30Days.contains(new Date()));

// BirthDate
const birthDate = BirthDate.create(new Date('1990-05-15'));
console.log('Age:', birthDate.getAge());
console.log('Zodiac:', birthDate.getZodiacSign());
console.log('Days Until Birthday:', birthDate.getDaysUntilBirthday());
console.log('Is Birthday Today:', birthDate.isBirthdayToday());

// ===== Error Handling =====

// Broken Rules Example
try {
  const invalidName = Name.create('A', 'B'); // Too short
} catch (error) {
  console.log('Name Error:', error.message);
}

try {
  const invalidAge = Age.create(-5); // Negative
} catch (error) {
  console.log('Age Error:', error.message);
}

try {
  const invalidMoney = Money.create(100, 'INVALID'); // Invalid currency
} catch (error) {
  console.log('Money Error:', error.message);
}
```

## Running the Tests

Create a test file in the example app:

```bash
# In apps/example-app/src/
touch test-value-objects.ts
```

Add the examples above and run:

```bash
npm run start:dev
```

Then import and execute the test function in your main.ts or any controller.

## Using in Controllers

Example of using value objects in a NestJS controller:

```typescript
@Controller('users')
export class UsersController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    // Validate and create value objects
    const name = Name.create(dto.firstName, dto.lastName);
    const age = Age.create(dto.age);
    const phone = PhoneNumber.create(dto.phone);

    // Use them in your domain logic
    return {
      name: name.getFullName(),
      age: age.getValue(),
      category: age.getCategory(),
      phone: phone.getFormatted(),
    };
  }

  @Get('calculate-price')
  calculatePrice(@Query('amount') amount: number, @Query('discount') discount: number) {
    const price = Money.create(amount, 'USD');
    const discountPercentage = Percentage.create(discount);

    const finalAmount = discountPercentage.decrease(price.amount);
    const finalPrice = Money.create(finalAmount, 'USD');

    return {
      original: price.format(),
      discount: discountPercentage.format(),
      final: finalPrice.format(),
    };
  }
}
```
