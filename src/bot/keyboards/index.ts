import {
    Keyboard,
} from "grammy";

const labelsKeyboardSex = ["Я девушка", "Я парень"];
const buttonRowsSex = labelsKeyboardSex.map((label) => [Keyboard.text(label)]);
export const keyboardSex = Keyboard.from(buttonRowsSex)
    .toFlowed(labelsKeyboardSex.length)
    .resized()
    .oneTime();

const labelsKeyboardInterest = ["Девушки", "Парни", "Не важно"];
const buttonRowsInterest = labelsKeyboardInterest.map((label) => [
    Keyboard.text(label),
]);

export const keyboardInterest = Keyboard.from(buttonRowsInterest)
    .toFlowed(labelsKeyboardInterest.length)
    .resized()
    .oneTime();

export const keyboardDescriprion = new Keyboard()
    .text("Пропустить")
    .row()
    .resized()
    .oneTime();

export const keyboardProfile = new Keyboard()
    .text("1")
    .text("2")
    .text("3")
    .text("4")
    .row()
    .resized()
    .oneTime();

export const keyboardRate = new Keyboard()
    .add()
    .text("❤️")
    .text("👎")
    .text("💤")
    .row()
    .resized()
    .oneTime();


const labelsKeyboardStop = ["1", "2", "3"];
const buttonRowsStop = labelsKeyboardStop.map((label) => [
    Keyboard.text(label),
]);
export const keyboardStop = Keyboard.from(buttonRowsStop)
    .toFlowed(labelsKeyboardStop.length)
    .resized()
    .oneTime();