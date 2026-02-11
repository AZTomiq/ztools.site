Summary
Multiple emoji icons (🛠️, 💰, 📝, ⚙️, 🗓️, 💻, 🐸) are not registered in the Lucide icon system, generating 18 console warnings on page load. This should not impact functionality but indicates incomplete icon configuration that could affect maintainability and accessibility.
Issue preview
Impact
Console warnings appear when the Bookmark Creator page loads, which may confuse users who check browser tools and could make the page appear broken or poorly maintained.
How to fix

FIX INTENT: Register missing emoji icons in the Lucide icon system

CONTEXT: The Bookmark Creator page displays 18 console warnings on load because 6 emoji icons (🛠️, 💰, 📝, ⚙️, 🗓️, 💻, 🐸) are not registered in the Lucide icon configuration. Each icon generates 3 warnings stating the icon name was not found in the icons object.

## FIX PROMPT: Help me register the missing emoji icons (hammer, coins, notepad, settings, calendar, laptop, frog) in the Lucide icon system so they display properly without console warnings

Usability - Silent BMI calculation failure with zero height input

high

Open
|

Summary
The BMI Calculator does not validate that height must be > 0. When zero height is entered, the form silently accepts it and displays a nonsensical calculation result (22.5) instead of rejecting the input or showing an error. This causes silent data integrity failure and could mislead users about health calculations.
Issue preview
Impact
Users receive incorrect and misleading health information when entering zero height, as the calculator silently accepts invalid input and displays a false BMI result instead of alerting them to the error.
Invalid health data could be recorded or relied upon, creating a silent failure that undermines trust in the calculator's accuracy.
How to fix

FIX INTENT: Add validation to reject zero or invalid height values in the BMI calculator

CONTEXT: The BMI Calculator at https://iztools.xyz/bmi/ accepts zero as a valid height input and displays an incorrect result (22.5) instead of showing an error. When height is 0 cm and weight is 65 kg, the form should reject this invalid input but currently does not.

## FIX PROMPT: Help me add input validation to the BMI calculator so that it rejects height values of zero or less, displays a clear error message to the user, and prevents calculation until valid height is entered.

Usability - Systemic input validation failure in BMI Calculator (zero/negative values)

high

Open
|

Summary
Systemic validation bug: BMI Calculator accepts zero and negative height values without any error checking. Both 0 cm and -170 cm produce identical nonsensical BMI results. This compromises data integrity and misleads users about health calculations.
Issue preview
Impact
Users can enter invalid height values (zero or negative) and receive misleading health calculations, which could lead to incorrect health decisions based on false BMI results.
The calculator lacks basic data validation, allowing nonsensical inputs that compromise the reliability and trustworthiness of the health information provided.
How to fix

FIX INTENT: Add validation to reject zero and negative height values in the BMI Calculator

CONTEXT: The BMI Calculator at https://iztools.xyz/bmi/ accepts invalid height inputs like 0 cm and -170 cm without any error checking. Both produce identical incorrect results (BMI of 22.5), misleading users about their health metrics.

## FIX PROMPT: Add input validation to the BMI Calculator form that rejects zero and negative height values. Display a clear error message when users try to submit invalid height data, and prevent the calculation from running until valid positive values are entered.

---

Usability - Easy-to-read mode not restricting character set in Password Generator

high

Open
|

Summary
Password Generator 'Easy-to-read' mode does not work correctly. Generated passwords still contain numbers and special characters despite the mode restricting character set. Multiple passwords lack proper delimiter, making them difficult to parse.
Issue preview
Impact
Users cannot generate easy-to-read passwords without numbers and special characters, defeating the purpose of the mode and making passwords harder to remember and type.
Generated passwords lack clear separation, making it difficult for users to identify where one password ends and another begins when generating multiple passwords.
How to fix

FIX INTENT: Make Easy-to-read mode filter out numbers and special characters, and add clear delimiters between multiple passwords

CONTEXT: The Password Generator's 'Easy-to-read' mode is not working correctly. When enabled with quantity set to 5, it still generates passwords containing numbers and special characters (like 'h)+v<6HQ9H&k <6u4v|ApHW%[ H(vfm6z,<SM('). Additionally, multiple passwords are only separated by spaces, making them hard to distinguish from each other.

## FIX PROMPT: Fix the Password Generator so that when 'Easy-to-read' mode is enabled, it only generates passwords with letters (a-z, A-Z), and when multiple passwords are generated, separate each one on a new line or with a clear delimiter like a dash or pipe character

Performance - Duplicate Monaco Editor module definition warning

low

Open
|

Summary
Monaco Editor is loading with a duplicate module definition warning. This could indicate inefficient module loading or configuration issue that may impact performance or cause editor initialization delays.
Issue preview
Impact
Monaco Editor may load slowly or experience initialization delays, affecting the responsiveness of the code editor on the playground.
Duplicate module definitions could cause unexpected behavior or conflicts in the editor's functionality.
How to fix

FIX INTENT: Remove duplicate Monaco Editor module definition warning

CONTEXT: The zTool Playground page at https://iztools.xyz/web-playground/ shows a console warning "Duplicate definition of module 'vs/editor/editor.main'" when Monaco Editor loads. This suggests the editor module is being loaded or defined multiple times in the page configuration.

FIX PROMPT: Help me fix the Monaco Editor module loading configuration to eliminate the duplicate module definition warning. The module 'vs/editor/editor.main' should only be defined once during initialization.

--
Usability - Unit Converter swap button parsing error with comma-formatted numbers

medium

Open
|

Summary
Unit Converter swap button throws a parsing error when trying to handle formatted numbers with comma separators. The swap functionality fails to properly exchange units bidirectionally.
Issue preview
Impact
Users cannot swap units in the converter when numbers contain comma separators, breaking the bidirectional conversion feature.
The converter displays parsing errors in the console, preventing accurate unit exchanges and calculations.
How to fix

FIX INTENT: Fix the swap button to handle comma-formatted numbers without parsing errors

CONTEXT: The Unit Converter swap button fails when numbers are formatted with commas (like 1,234.56789). When users click the swap button to exchange FROM and TO units, the application throws a parsing error and doesn't properly recalculate the values in the new unit order.

## FIX PROMPT: Help me fix the Unit Converter swap button so it correctly handles numbers with comma separators, properly exchanges the FROM and TO units, and recalculates the converted value without console errors

Usability - Base64 Decode button broken in Hash Toolkit

critical

Open
|

Summary
Base64 Decode button is completely broken. It throws a validation error and doesn't decode Base64 strings properly. The button logic appears to be reversed, treating plain text as Base64 instead of Base64 as the source for decoding.
Issue preview
Impact
Users cannot decode Base64-encoded strings, breaking a core feature of the Hash Toolkit and preventing them from converting encoded data back to readable text.
The tool shows an error message instead of working, making the decode feature completely unusable.
How to fix

FIX INTENT: Fix the Base64 Decode button to properly decode Base64 strings

CONTEXT: The Base64 Decode button in the Hash Toolkit is broken. When users encode plain text to Base64 and then try to decode it back, the button throws a validation error saying "Lỗi: Định dạng Base64 không hợp lệ" (Invalid Base64 format). The decode logic appears reversed—it's trying to decode the input field (plain text) instead of the output field (Base64-encoded string).

FIX PROMPT: Fix the Base64 Decode button so it reads the Base64-encoded string from the output field, decodes it back to plain text, and displays the result. Make sure the decode function properly handles the encoded data and doesn't throw validation errors.
