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

export const keyboardName = (ctx: CustomContext) => {
    const labelsKeyboardName: string[] = [ctx.session.myProfile ? ctx.session.myProfile.name : '', ctx.from?.first_name as string];
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


export const keyboardAge = (ctx: CustomContext) => {
    const labelsKeyboardAge: string[] = [ctx.session.myProfile!.age.toString()];
    const buttonRowsAge = labelsKeyboardAge.map((label) => [
        Keyboard.text(label.toString()),
    ]);
    return Keyboard.from(buttonRowsAge).resized().oneTime();
}

export const keyboardCity = (ctx: CustomContext) => {
    const labelsKeyboardCity: string[] = [ctx.session.myProfile!.city];
    const buttonRowsCity = labelsKeyboardCity.map((label) => [
        Keyboard.text(label.toString()),
    ]);
    return Keyboard.from(buttonRowsCity).resized().oneTime();
}

export const keyboardMedia = new Keyboard()
    .text("Оставить текущее")
    .row()
    .resized()
    .oneTime();