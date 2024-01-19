import {
    Keyboard,
} from "grammy";
import { CustomContext } from "../types/CustomContext.js";

export const labelsKeyboardSex = ["Я девушка", "Я парень"];
const buttonRowsSex = labelsKeyboardSex.map((label) => [Keyboard.text(label)]);
export const keyboardSex = Keyboard.from(buttonRowsSex)
    .toFlowed(labelsKeyboardSex.length)
    .resized()
    .oneTime();

export const labelsKeyboardInterest = ["Девушки", "Парни", "Не важно"];
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


// export const labelsKeyboardName: string[] = [];
// const buttonRowsName = labelsKeyboardName.map((label) => [Keyboard.text(label)]);
// export const keyboardName = Keyboard.from(buttonRowsName).resized().oneTime();
export const keyboardName = (ctx: CustomContext) => {
    const labelsKeyboardName: string[] = [ctx.from?.first_name as string];
    const buttonRowsName = labelsKeyboardName.map((label) => [Keyboard.text(label)]);
    return Keyboard.from(buttonRowsName).resized().oneTime();
}

export const labelsKeyboardConfirmProfile = ["Да", "Изменить анкету"];
const buttonRowsConfirmProfile = labelsKeyboardConfirmProfile.map((label) => [
    Keyboard.text(label.toString()),
]);
export const keyboardConfirmProfile = Keyboard.from(buttonRowsConfirmProfile)
    .toFlowed(labelsKeyboardConfirmProfile.length)
    .resized()
    .oneTime()
    .append();