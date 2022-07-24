import {Knex} from "knex";
import * as Process from "process";
import moment from "moment";

import httpClient from "../../utils/http-client"
import {dayType} from "../../common-types/restaurant";
import SaveRestaurantModule from "../../usecases/restaurant/save-module"

export async function seed(knex: Knex): Promise<void> {
    await knex("restaurant_timing").del();
    await knex("restaurant").del();

    return httpClient({
        method: 'get',
        url: 'https://gist.githubusercontent.com/seahyc/7ee4da8a3fb75a13739bdf5549172b1f/raw/f1c3084250b1cb263198e433ae36ba8d7a0d9ea9/hours.csv',
        responseType: 'stream'
    }).then((stream) => {
        let lastRow = "";
        const allDbPromises: any = [];
        stream.on("data", async (chunk: any) => {
            stream.pause();
            const chunkInString = lastRow + chunk.toString();
            const rows = chunkInString.split("\n");
            lastRow = "";
            const restaurantPromises = [];
            for (let i = 0; i < rows.length - 1; i++) {
                const rowArr = rows[i].split(',"');
                const formattedRestaurant = {
                    name: rowArr[0].replace(/['"]+/g, ''),
                    days: getAllDaysWithTimings(rowArr[1].replace(/['"]+/g, ''))
                };
                restaurantPromises.push((new SaveRestaurantModule(formattedRestaurant)).saveWithoutTransacting());
            }
            lastRow = rows[rows.length - 1];
            const aPromise = Promise.all(restaurantPromises)
                .then(() => {
                    stream.resume();
                }).catch(() => {
                    Process.exit(-1)
                });
            allDbPromises.push(aPromise);
        });

        return new Promise((resolve, _) => {
            stream.on("end", () => {
                Promise.all(allDbPromises)
                    .then(() => {
                        const rowArr = lastRow.split(',"');
                        const formattedRestaurant = {
                            name: rowArr[0].replace(/['"]+/g, ''),
                            days: getAllDaysWithTimings(rowArr[1].replace(/['"]+/g, ''))
                        };
                        return (new SaveRestaurantModule(formattedRestaurant)).saveWithoutTransacting();
                    }).then(() => {
                    resolve();
                });
            });
        })
    });
};

function getAllDaysWithTimings(daysStr: string) {
    daysStr = daysStr.replace(/ /g, '')

    const slots = daysStr.split("/");
    let dayFormat: Array<dayType> = [];

    for (const slot of slots) {
        dayFormat = [...dayFormat, ...parseDaysFromSlots(slot)];
    }

    return dayFormat;
}


function parseDaysFromSlots(slot: string) {

    const daysRange = [];
    let dayRange = [];
    let newDay = "";
    let time = "";
    let i = 0
    for (i; i < slot.length; i++) {
        if (slot[i] >= "1" && slot[i] <= "9") {
            dayRange.push(newDay);
            daysRange.push(dayRange);
            dayRange = []
            newDay = "";
            break;
        } else if (slot[i] === "-") {
            dayRange.push(newDay);
            newDay = "";
        } else if (slot[i] === ",") {
            dayRange.push(newDay);
            daysRange.push(dayRange);
            dayRange = []
            newDay = "";
        } else {
            newDay += slot[i];
        }
    }

    for (i; i < slot.length; i++) {
        time += slot[i];
    }

    const timeDuration = time.split("-")
    const startTime = timeDuration[0];
    const endTime = timeDuration[1]
    return convertDaysRangeWithTime(daysRange, startTime, endTime);
}

function convertDaysRangeWithTime(daysRange: Array<Array<string>>, startTime: string, endTime: string) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayHash = {
        "Mon": "monday",
        "Tue": "tuesday",
        "Wed": "wednesday",
        "Thu": "thursday",
        "Fri": "friday",
        "Sat": "saturday",
        "Sun": "sunday"
    };

    const conversion = {
        "Tues": "Tue",
        "Weds": "Wed",
        "Thurs": "Thu"
    }

    const timeLines = [];
    for (const slot of daysRange) {
        const startSlot = dayHash[slot[0] as keyof typeof dayHash] ? slot[0] : conversion[slot[0] as keyof typeof conversion];
        const endSlot = slot[1] ? (dayHash[slot[1] as keyof typeof dayHash] ? slot[1] : conversion[slot[1] as keyof typeof conversion]) : startSlot;
        let startSlotIndex = days.indexOf(startSlot);

        for (startSlotIndex; days[startSlotIndex] !== endSlot; startSlotIndex = (startSlotIndex + 1) % days.length) {
            timeLines.push({
                day: dayHash[days[startSlotIndex] as keyof typeof dayHash],
                startTime: convertTo24Hours(startTime),
                endTime: convertTo24Hours(endTime)
            });
        }
        timeLines.push({
            day: dayHash[days[startSlotIndex] as keyof typeof dayHash],
            startTime: convertTo24Hours(startTime),
            endTime: convertTo24Hours(endTime)
        });
    }
    return timeLines;
}

function convertTo24Hours(time: string) {
    return moment(time, ["h:mm A"]).format("HH:mm");
}


